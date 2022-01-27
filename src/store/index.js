import { createStore } from 'vuex';
import PortfolioService from '@/api/PortfolioService.js';
import UserProfileService from '@/api/UserProfileService.js';
import ProjectService from '@/api/ProjectService.js';
import GoogleSignInService from '@/api/GoogleSignInService.js';
import LivePriceService from '@/api/LivePriceService.js';
import PortfolioComputer from '@/api/computers/PortfolioComputer.js';
import sort from '@/library/helpers/sort.js';

const loggedIn = Number(localStorage.getItem('_m_xu__')) === 1;

export default createStore({
  state: {
    user: {
      loggedIn,
      data: {
        displayName: null,
        photoURL: null,
      },
    },
    portfolios: [],
    currentPortfolio: {},
    searchProjectsResult: null,
    currency: 'EUR',
    livePriceUpdated: null,
  },
  getters: {
    user(state) {
      return state.user;
    },
  },
  mutations: {
    SET_LOGGED_IN(state, value) {
      state.user.loggedIn = value;
      localStorage.setItem('_m_xu__', value ? 1 : 0);
    },
    SET_USER(state, data) {
      state.user.data = { ...state.user.data, ...data };
    },
    UPDATE_PORTFOLIOS(state, value) {
      state.portfolios = value;
    },
    SET_CURRENT_PORTFOLIO(state, value) {
      state.currentPortfolio = value;
    },
    SET_SEARCH_PROJECTS_RESULT(state, value) {
      state.searchProjectsResult = value;
    },
    SET_CURRENT_PORTFOLIO_PROJECTS(state, projects) {
      state.currentPortfolio.projects = projects;
    },
    SET_CURRENCY(state, currency) {
      state.currency = currency;
    },
    UPDATE_CURRENT_PORTFOLIO_VALUE(state, value) {
      state.currentPortfolio.value = value;
    },
    UPDATE_CURRENT_PORTFOLIO_PERFORMANCE(state, value) {
      state.currentPortfolio.performance = value;
    },
    UPDATE_CLIVE_PRICE_TS(state) {
      state.livePriceUpdated = Date.now();
    },
  },
  actions: {
    updateUser({ commit, dispatch }, user) {
      commit('SET_LOGGED_IN', !!(user && user.uid));
      if (user) {
        commit('SET_USER', {
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          uid: user.uid,
          token: user.token,
        });

        //dispatch('getUserPortfolios', user.uid);
        dispatch('getUserProfile', user.uid);
      } else {
        commit('SET_USER', null);
      }
    },
    async getUserProfile({ state, commit, dispatch }, userId) {
      const profile = await UserProfileService.getUserProfile(userId);
      commit('SET_USER', {
        ...state.user,
        profile,
      });
      dispatch('getDefaultPortfolio', profile.default_portfolio);
    },
    async getUserPortfolios({ commit }, userId) {
      const portfolios = await PortfolioService.allByOwner(userId);
      commit('UPDATE_PORTFOLIOS', portfolios);
    },
    getDefaultPortfolio({ commit, dispatch }, portfolioId) {
      PortfolioService.portfolio(portfolioId, (portfolio) => {
        portfolio = PortfolioComputer.netValue(portfolio);
        commit('SET_CURRENT_PORTFOLIO', portfolio);
        commit('SET_CURRENCY', portfolio.currency);
        console.log('portfolio :>> ', portfolio);
        dispatch('getPortfolioProjects', Object.keys(portfolio.projects));
      });
    },
    addPortfolio(__, portfolio) {
      return PortfolioService.add(portfolio);
    },
    login(__, onSuccess, onError) {
      return GoogleSignInService.login(onSuccess, onError);
    },
    logout(__, onLogout) {
      return GoogleSignInService.logout(onLogout);
      //commit('SET_USER', null);
      //commit('SET_LOGGED_IN', false);
    },
    async searchProjects({ commit }, term) {
      if (term) {
        const projects = await ProjectService.search(term);
        commit('SET_SEARCH_PROJECTS_RESULT', projects);
      } else {
        commit('SET_SEARCH_PROJECTS_RESULT', null);
      }
    },
    resetSearchProjects({ commit }) {
      commit('SET_SEARCH_PROJECTS_RESULT', null);
    },
    async addProjectToPortfolio(
      {
        state: {
          currentPortfolio: { id: portfolioId, projects },
        },
        dispatch,
      },
      { id: projectId }
    ) {
      dispatch('resetSearchProjects');
      const project = await PortfolioService.addProject(portfolioId, projectId);
      dispatch('getPortfolioProjects', Object.keys(projects));

      return project;
    },
    async getPortfolioProjects(
      { state: { currentPortfolio, currency }, commit },
      projectsId
    ) {
      const projects = await ProjectService.projects(projectsId);
      const currentPortfolioProjects = currentPortfolio.projects;

      if (Array.isArray(projects)) {
        projects.forEach((project) => {
          currentPortfolioProjects[project.id] = {
            ...currentPortfolioProjects[project.id],
            ...project,
          };
        });

        //TODO find best/worst performing project to portfolio agains gains and 24h to add to cards in the dashboard


        LivePriceService.live(
          {
            ids: projectsId,
            vs_currencies: [currency],
            include_last_updated_at: true,
            include_24hr_vol: true,
            include_24hr_change: true,
          },
          (livePriceUpdate) => {
            let portfolioValue = 0;
            let portfolio24h = 0;

            projectsId.map((project) => {
              const livePrice = livePriceUpdate[project];
              if (livePrice) {
                const clc = currency.toLowerCase();
                let current = currentPortfolioProjects[project];
                const value = current.total_holdings * livePrice[clc];

                let  change_percentage = ((value - current.net_value)/current.net_value) * 100;
                
                if(current.net_value < 0){
                  change_percentage = ((value - current.net_value)/Math.abs(current.net_value)) * 100;
                } 

                const change_24h = livePrice[`${clc}_24h_change`];

                portfolio24h = portfolio24h + change_24h;

                currentPortfolioProjects[project] = {
                  ...current,
                  price: livePrice[clc],
                  value,
                  vol_24h: livePrice[`${clc}_24h_vol`],
                  change_24h,
                  change_x: Number(Number(value / current.net_value).toFixed(2)),
                  change_percentage,
                  profitloss: value - current.net_value
                };

                portfolioValue =
                  portfolioValue + currentPortfolioProjects[project].value;
              }
            });
            console.log('portfolio24h = portfolio24h / projectsId.length :>> ', portfolio24h, projectsId.length, portfolio24h / projectsId.length);
            portfolio24h = portfolio24h / projectsId.length;

            const sortedByValueProjects = sort(currentPortfolioProjects, 'value', 'desc');
            const sortedByLast24hProjects = sort(currentPortfolioProjects, 'change_24h', 'desc');
            const sortedByProfitLossProjects = sort(currentPortfolioProjects, 'change_x', 'desc');
            const performance = {
              change_24h: portfolio24h,
              top_24h: sortedByLast24hProjects[0],
              bottom_24h: sortedByLast24hProjects[sortedByLast24hProjects.length - 1],
              top_profit: sortedByProfitLossProjects[0],
              bottom_profit: sortedByProfitLossProjects[sortedByProfitLossProjects.length - 1],
            }

            commit('UPDATE_CURRENT_PORTFOLIO_PERFORMANCE', performance);
            commit('UPDATE_CURRENT_PORTFOLIO_VALUE', portfolioValue);
            commit('SET_CURRENT_PORTFOLIO_PROJECTS', sortedByValueProjects);
            commit('UPDATE_CLIVE_PRICE_TS');
          }
        );
      }
    },
    addTransactionToProject(
      {
        state: {
          currentPortfolio: { id: portfolioId },
        },
      },
      { project, transaction }
    ) {
      return PortfolioService.addTransactionToProject(
        portfolioId,
        project,
        transaction
      );
    },
    sortProjects({state: {currentPortfolio: {projects}}, commit}, field = 'change_24h', order = 'desc'){
      commit('SET_CURRENT_PORTFOLIO_PROJECTS', sort(projects, field, order));
    }
  },
});

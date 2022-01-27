import ProjectComputer from './ProjectComputer.js';

export default {
  netValue(portfolio) {
    const computed = JSON.parse(JSON.stringify(portfolio));

    computed.net_value = Object.entries(computed.projects).reduce(
      (accumulator, [id, project]) => {
        const projectComputedValues = ProjectComputer.compute(
          project.transactions
        );

        computed.projects[id] = {
          ...computed.projects[id],
          ...projectComputedValues,
        };

        return accumulator + projectComputedValues.net_value;
      },
      0
    );

    return computed;
  },
};

import Navbar from '@/library/components/navbar/Navbar.vue';
import Modal from '@/library/components/modal/Modal.vue';
import Button from '@/library/components/button/Button.vue';
import Input from '@/library/components/input/Input.vue';
import SearchInput from '@/library/components/search-input/SearchInput.vue';
import Table from '@/library/components/table/Table.vue';
import Indicator from '@/library/components/indicator/Indicator.vue';
import ChangeValue from '@/library/components/change-value/ChangeValue.vue';
import LoadingBox from '@/library/components/loading-box/LoadingBox.vue';

export function registerComponents(app) {
  app.component('Navbar', Navbar);
  app.component('Modal', Modal);
  app.component('Button', Button);
  app.component('Input', Input);
  app.component('SearchInput', SearchInput);
  app.component('Table', Table);
  app.component('Indicator', Indicator);
  app.component('ChangeValue', ChangeValue);
  app.component('LoadingBox', LoadingBox);
}

import Vue from 'vue'
import {
  Button,
  Form,
  FormItem,
  Input,
  Message,
  Aside,
  Container,
  Header,
  Main,
  Menu,
  MenuItem,
  Row,
  Col,
  Table,
  TableColumn,
  Breadcrumb,
  BreadcrumbItem,
  Pagination,
  Tooltip,
  Tag,
  Dialog,
  Radio,
  Upload,
  MessageBox,
  Submenu,
  Drawer,
  Card
} from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Aside)
Vue.use(Container)
Vue.use(Main)
Vue.use(Header)
Vue.use(Menu)
Vue.use(MenuItem)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Pagination)
Vue.use(Tooltip)
Vue.use(Tag)
Vue.use(Dialog)
Vue.use(Radio)
Vue.use(Upload)
Vue.use(Submenu)
Vue.use(Drawer)
Vue.use(Card)

Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm
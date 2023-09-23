// Types
import ROUTE from "./utils/Route";
import AUTHENTICATED_ROUTE from "./utils/AuthenticatedRoute";
import UNAUTHENTICATED_ROUTE from "./utils/UnauthenticatedRoute";

// Layouts
import DASHBOARD from "./layouts/Dashboard";
import SITE from "./layouts/Site";

// Pages
import Auth_Login from "./pages/Auth/Login";
import Auth_Logout from "./pages/Auth/Logout";
import Dashboard_Panel from "./pages/Dashboard/Panel";
import Dashboard_Profile_EditUser from "./pages/Dashboard/Profile/EditUser";
import UserManagement_User_List from "./pages/UserManagement/User/List";
import UserManagement_User_Add from "./pages/UserManagement/User/Add";
import UserManagement_User_Edit from "./pages/UserManagement/User/Edit";
import UserManagement_Role_List from "./pages/UserManagement/Role/List";
import UserManagement_Role_ListPermission from "./pages/UserManagement/Role/ListPermission";
import UserManagement_Permission_List from "./pages/UserManagement/Permission/List";
import AmountManagement_Payment_List from "./pages/AmountManagement/Payment/List";

export default [
  {
    type: UNAUTHENTICATED_ROUTE,
    layout: SITE,
    menu: [],
    component: Auth_Login,
    breadcrumb: [],
  },
  {
    alias: "logout",
    type: AUTHENTICATED_ROUTE,
    layout: SITE,
    menu: [],
    component: Auth_Logout,
    breadcrumb: [],
  },
  {
    title: "dashboard",
    alias: "dashboard",
    type: AUTHENTICATED_ROUTE,
    layout: DASHBOARD,
    menu: ["DASHBOARD"],
    component: Dashboard_Panel,
    icon: "tachometer",
    breadcrumb: [],
  },
  {
    title: "editUser",
    alias: "edit-user",
    type: AUTHENTICATED_ROUTE,
    layout: DASHBOARD,
    menu: [],
    component: Dashboard_Profile_EditUser,
    breadcrumb: ["DASHBOARD"],
  },
  {
    title: "userManagement",
    alias: "user-management",
    type: AUTHENTICATED_ROUTE,
    layout: DASHBOARD,
    menu: ["DASHBOARD"],
    icon: "users",
    breadcrumb: ["DASHBOARD"],
    link: false,
    roles: ["ADMIN"],
    routes: [
      {
        title: "useList",
        alias: "user",
        type: AUTHENTICATED_ROUTE,
        layout: DASHBOARD,
        menu: ["DASHBOARD"],
        divider: false,
        component: UserManagement_User_List,
        icon: "male",
        breadcrumb: ["DASHBOARD"],
        roles: ["ADMIN"],
        routes: [
          {
            title: "addUser",
            alias: "add",
            type: AUTHENTICATED_ROUTE,
            layout: DASHBOARD,
            menu: [],
            component: UserManagement_User_Add,
            breadcrumb: ["DASHBOARD"],
            roles: ["ADMIN"],
          },
          {
            title: "editUser",
            alias: "edit",
            dynamic: true,
            type: AUTHENTICATED_ROUTE,
            layout: DASHBOARD,
            menu: [],
            component: UserManagement_User_Edit,
            breadcrumb: ["DASHBOARD"],
            roles: ["ADMIN"],
          },
        ],
      },
      {
        title: "roleList",
        alias: "role",
        type: AUTHENTICATED_ROUTE,
        layout: DASHBOARD,
        menu: ["DASHBOARD"],
        divider: false,
        component: UserManagement_Role_List,
        icon: "user-secret",
        breadcrumb: ["DASHBOARD"],
        roles: ["ADMIN"],
        routes: [
          {
            title: "rolePermissionList",
            dynamic: true,
            type: AUTHENTICATED_ROUTE,
            layout: DASHBOARD,
            menu: [],
            component: UserManagement_Role_ListPermission,
            breadcrumb: ["DASHBOARD"],
            roles: ["ADMIN"],
          },
        ],
      },
      {
        title: "permissionList",
        alias: "permission",
        type: AUTHENTICATED_ROUTE,
        layout: DASHBOARD,
        menu: ["DASHBOARD"],
        divider: false,
        component: UserManagement_Permission_List,
        icon: "shield",
        breadcrumb: ["DASHBOARD"],
        roles: ["ADMIN"],
      },
    ],
  },
  {
    title: "amountManagement",
    alias: "amount-management",
    type: AUTHENTICATED_ROUTE,
    layout: DASHBOARD,
    menu: ["DASHBOARD"],
    icon: "university",
    breadcrumb: ["DASHBOARD"],
    link: false,
    roles: ["ADMIN", "BASIC_ROLE"],
    routes: [
      {
        title: "paymentList",
        alias: "payment",
        type: AUTHENTICATED_ROUTE,
        layout: DASHBOARD,
        menu: ["DASHBOARD"],
        divider: false,
        component: AmountManagement_Payment_List,
        icon: "usd",
        breadcrumb: ["DASHBOARD"],
        roles: ["ADMIN", "BASIC_ROLE"],
      },
    ],
  },
];

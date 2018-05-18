// @flow

import React from 'react';
import { applyRouterMiddleware, browserHistory, Router, Route, IndexRoute } from 'react-router';
import { useScroll } from 'react-router-scroll';
import { kebabCase, titleize } from 'training/src/utils/helpers';
import AppFrame from 'training/src/components/AppFrame';
// import AppContent from 'training/src/components/AppContent';
// import MarkdownDocs from 'training/src/components/MarkdownDocs';
import Home from 'training/src/pages/Home';
// import { componentAPIs, requireMarkdown, demos, requireDemo } from 'training/src/components/files';

import Enrolled from '../pages/com/enrolled/enrolled.page.js';
import Enrolled_Comp from '../pages/com/enrolled/enrolled_comp.page.js';
//import Instructions from '../pages/com/instructions/instructions.page.js';
import Password from '../pages/com/infos/admin.paper.js';
import CompanyHome from '../pages/com/home/home.page.js';
//import CompanyHomeComp from '../pages/com/home/home-comp.page.js';
import Students from '../pages/com/students/students.page.js';
import Exams from '../pages/com/exams/exams.page.js';
import Resit from '../pages/com/resit/resit.page.js';
import Infos from '../pages/com/infos/info.page.js';
import Lang from '../language';
import { getData, getRouter, getCity } from '../utils/helpers';

import { APP_TYPE_UNLOGIN, APP_TYPE_COMPANY, APP_TYPE_ORANIZATION, INST_QUERY } from '../enum';


var AppRouter = {

  1: (<Router history={browserHistory} render={applyRouterMiddleware(useScroll())}>
    <Route title="Training" path="/" component={AppFrame} >
      <IndexRoute dockDrawer title={titleize(Lang[window.Lang].pages.com.home.title)} nav component={CompanyHome} />
     
      <Route
        title={titleize(Lang[window.Lang].pages.com.home.title)}
        path={'/com/home'}
        content={CompanyHome}
        nav
        component={CompanyHome}
      /> 
      <Route
        title={titleize(Lang[window.Lang].pages.com.infos.title)}
        path={'/com/infos'}
        content={Infos}
        nav
        component={Infos}
      />
      {sessionStorage.classify==1?<Route
        title={titleize(Lang[window.Lang].pages.com.enrolled.title)}
        path={'/com/enrolled'}
        content={Enrolled}
        nav
        component={Enrolled}
      />:<Route
      title={titleize(Lang[window.Lang].pages.com.enrolled.title)}
      path={'/com/enrolled_comp'}
      content={Enrolled_Comp}
      nav
      component={Enrolled_Comp}
    />}
      {sessionStorage.classify==1?<Route
        title={titleize(Lang[window.Lang].pages.com.resit.title)}
        path={'/com/resit'}
        content={Resit}
        nav
        component={Resit}
      />:""}
      
      <Route
        title={titleize(Lang[window.Lang].pages.com.infos.admin.account_info)}
        path={'/com/password'}
        content={Password}
        nav
        component={Password}
      />
    </Route>

  </Router>)

}



export default AppRouter;
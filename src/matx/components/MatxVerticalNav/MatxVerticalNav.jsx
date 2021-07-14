import React, { useEffect } from "react";
import { NavLink, withRouter } from "react-router-dom";
import { Icon } from "@material-ui/core";
import TouchRipple from "@material-ui/core/ButtonBase";
// import MatxVerticalNavExpansionPanel from "./MatxVerticalNavExpansionPanel";
import MatxVerticalNavExpansionPanel from './MatxVerticalNavClickExpansionPanel';
import { withStyles } from "@material-ui/styles";
import { useSelector } from "react-redux";

const styles = theme => ({
  expandIcon: {
    transition: "transform 225ms cubic-bezier(0, 0, 0.2, 1) 0ms",
    transform: "rotate(90deg)"
  },
  collapseIcon: {
    transition: "transform 225ms cubic-bezier(0, 0, 0.2, 1) 0ms",
    transform: "rotate(0deg)"
  }
});

const MatxVerticalNav = props => {
  const navigations = useSelector(({ navigations }) => navigations);

  const [currentPath, setCurrentPath] = React.useState('');

  useEffect(() => {
    function handlePathChange(location, action) {
      setCurrentPath(location.pathname);
    }
    let pathListener = props.history.listen(handlePathChange);
    // Specify how to clean up after this effect:
    return function cleanup() {
      pathListener();
    };
  });

  const renderLevels = data => {
    return data.map((item, index) => {
      if (item.children) {
        return (
          <MatxVerticalNavExpansionPanel item={item} key={index}>
            {renderLevels(item.children)}
          </MatxVerticalNavExpansionPanel>
        );
      } else if (item.type === "extLink") {
        return (
          <a
            key={index}
            href={item.path}
            className="nav-item"
            rel="noopener noreferrer"
            target="_blank"
          >
            <TouchRipple key={item.name} name="child" className="w-full">
              {(() => {
                if (item.icon) {
                  return (
                    <Icon className="item-icon align-middle">{item.icon}</Icon>
                  );
                } else {
                  return (
                    <span className="item-icon icon-text">{item.iconText}</span>
                  );
                }
              })()}
              <span className="align-middle item-text">{item.name}</span>
              <div className="mx-auto"></div>
              {item.badge && (
                <div className={`badge bg-${item.badge.color}`}>
                  {item.badge.value}
                </div>
              )}
            </TouchRipple>
          </a>
        );
      } else {
        {
          if (currentPath.split('/')[1] == item.path.split('/')[1] 
                && item.path.split('/')[2] != undefined
                && currentPath.split('/')[2] != undefined
                ) {
            return (
              <div key={index} to={item.path} className="nav-item active">
              {/* // <NavLink key={index} to={item.path} className="nav-item active"> */}
                <TouchRipple key={item.name} name="child" className="w-full">
                  {(() => {
                    if (item.icon) {
                      return (
                        <Icon className="item-icon align-middle">{item.icon}</Icon>
                      );
                    } else {
                      return (
                        <span className="item-icon icon-text">{item.iconText}</span>
                      );
                    }
                  })()}
                  <span className="align-middle item-text">{item.name}</span>
                  <div className="mx-auto"></div>
                  {item.badge && (
                    <div className={`badge bg-${item.badge.color}`}>
                      {item.badge.value}
                    </div>
                  )}
                </TouchRipple>
              {/* </NavLink> */}
              </div>
            );
          }
          else {
            return (
              <div key={index} to={item.path} className="nav-item">
              {/* <NavLink key={index} to={item.path} className="nav-item"> */}
                <TouchRipple key={item.name} name="child" className="w-full">
                  {(() => {
                    if (item.icon) {
                      return (
                        <Icon className="item-icon align-middle">{item.icon}</Icon>
                      );
                    } else {
                      return (
                        <span className="item-icon icon-text">{item.iconText}</span>
                      );
                    }
                  })()}
                  <span className="align-middle item-text">{item.name}</span>
                  <div className="mx-auto"></div>
                  {item.badge && (
                    <div className={`badge bg-${item.badge.color}`}>
                      {item.badge.value}
                    </div>
                  )}
                </TouchRipple>
              </div>
            );
          }
        }
        
      }
    });
  };

  return <div className="navigation">{renderLevels(navigations)}</div>;
};

export default withRouter(withStyles(styles)(MatxVerticalNav));

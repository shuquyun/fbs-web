import React from "react";
import PropTypes from "prop-types";
import { Icon, Switch } from "antd";
import { config } from "utils";
import styles from "./Layout.less";
import Menus from "./Menu";

const Sider = ({
    siderFold,
    darkTheme,
    location,
    navOpenKeys,
    changeOpenKeys,
    menu,
    changeSelectedMenu
}) => {
    const menusProps = {
        menu,
        siderFold,
        darkTheme,
        location,
        navOpenKeys,
        changeOpenKeys,
        changeSelectedMenu
    };
    return (
        <div>
            <div className={styles.logo}>
                <img alt="logo" src={config.logo} />
                {siderFold ? "" : <span>{config.name}</span>}
            </div>
            <Menus {...menusProps} />
        </div>
    );
};

Sider.propTypes = {
    menu: PropTypes.array,
    siderFold: PropTypes.bool,
    darkTheme: PropTypes.bool,
    location: PropTypes.object,
    changeTheme: PropTypes.func,
    navOpenKeys: PropTypes.array,
    changeOpenKeys: PropTypes.func
};

export default Sider;

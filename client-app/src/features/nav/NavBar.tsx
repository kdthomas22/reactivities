import React from "react";
import { Menu, Container, Button } from "semantic-ui-react";

interface INavBarProps {
  openCreateForm: () => void;
}

const NavBar: React.FC<INavBarProps> = ({ openCreateForm }) => {
  return (
    <Menu inverted fixed="top">
      <Container>
        <Menu.Item header>
          <img
            src="/assets/logo.png"
            alt="logo"
            style={{ marginRight: "10px" }}
          />
          Reactivities
        </Menu.Item>
        <Menu.Item name="Activities" />
        <Menu.Item>
          <Button positive content="Create Activity" onClick={openCreateForm} />
        </Menu.Item>
      </Container>
    </Menu>
  );
};

export default NavBar;

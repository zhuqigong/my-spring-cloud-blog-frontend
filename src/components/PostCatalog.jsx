import { useState } from "react";
import { CSSTransition } from "react-transition-group";
import { Icon } from "semantic-ui-react";

const CatalogSwitch = (props) => (
  <>
    <CSSTransition
      in={props.show}
      classNames="catalog-switch"
      timeout={300}
      unmountOnExit
    >
      <div
        className="catalog-container-switch"
        onMouseEnter={props.onMouseEnter}
      >
        <div className="name">
          Catalog
          <Icon name="chevron down" className="icon" color="red" />
        </div>
      </div>
    </CSSTransition>
  </>
);
const CatalogComponent = (props) => (
  <>
    <CSSTransition
      in={props.show}
      timeout={300}
      classNames="catalog"
      unmountOnExit
    >
      <div className="catalog-container" onMouseLeave={props.onMouseLeave}>
        <div>
          <Icon name="bookmark" style={{ color: "#52C75F" }} />
          Table Of Content
        </div>
        <div
          dangerouslySetInnerHTML={{ __html: props.catalog.catalog }}
          style={{ marginTop: "1em" }}
        />
      </div>
    </CSSTransition>
  </>
);
export default function Catalog(props) {
  const [showSwitch, setShowSwitch] = useState(true);
  const [showCatalog, setShowCatalog] = useState(false);
  const handlerMouseEnter = () => {
    setShowCatalog(true);
    setShowSwitch(false);
  };
  const handlerCatalogOnMouseLeave = () => {
    setShowCatalog(false);
    setShowSwitch(true);
  };

  return (
    <>
      {props.response.list && (
        <>
          {props.response.list.map(
            (p, index) =>
              p && (
                <>
                  <CatalogComponent
                    catalog={p}
                    onMouseLeave={handlerCatalogOnMouseLeave}
                    show={showCatalog}
                  />
                  <CatalogSwitch
                    show={showSwitch}
                    onMouseEnter={handlerMouseEnter}
                  />
                </>
              )
          )}
        </>
      )}
    </>
  );
}

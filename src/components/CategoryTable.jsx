import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Container, Icon, Table } from "semantic-ui-react";
import { ApiGet } from "../data/ApiGet";
import AnimationLayout from "./AnimationLayout";
import { CATAGORY_STATISTICS_URL } from "./Vars";

export default function CategoryTable() {
  const [data, setDataState] = useState([]);
  const [show, setShow] = useState(false);
  const his = useHistory();
  useEffect(() => {
    ApiGet(CATAGORY_STATISTICS_URL)
      .then((res) => {
        setDataState(res);
        setShow(true);
      })
      .catch((error) => {
        his.push("/500");
      });
  }, []);
  return (
    <>
      {data && data.length > 0 && (
        <AnimationLayout isShow={show}>
          <Container>
            <Table className="common-table" selectable>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>
                    <Icon name="bookmark" style={{ color: "#52C75F" }} />
                    Categories
                  </Table.HeaderCell>
                  <Table.HeaderCell>Total</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {data.map((e, index) => (
                  <>
                    <Table.Row key={index}>
                      <Table.Cell>
                        <a
                          style={{ display: "inline-block", width: "100%" }}
                          href={"/category/" + e.value}
                        >
                          {e.value}
                        </a>
                      </Table.Cell>
                      <Table.Cell>{e.count}</Table.Cell>
                    </Table.Row>
                  </>
                ))}
              </Table.Body>
            </Table>
          </Container>
        </AnimationLayout>
      )}
    </>
  );
}

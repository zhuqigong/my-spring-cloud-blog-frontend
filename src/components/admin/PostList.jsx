import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import {
  Button,
  Container,
  Grid,
  Header,
  Icon,
  Modal,
  Pagination,
  Table,
  TableHeader,
} from "semantic-ui-react";
import API from "../../data/DataUrl";
import AnimationLayout from "../AnimationLayout";
import Footer from "../Footer";

export default function AdminPostListCmp() {
  const CreateNewPostButton = () => (
    <>
      <Button positive as="a" href="/admin/post/edit/undefined">
        New Post...
      </Button>
    </>
  );
  const List = (props) => (
    <>
      <Container style={{ marginTop: "1em" }}>
        {WelcomeHeader()}
        {CreateNewPostButton()}
        <Table>
          <TableHeader>
            <Table.Row>
              <Table.HeaderCell>
                <Icon name="bookmark" style={{ color: "#52C75F" }} />
                Title
              </Table.HeaderCell>
              <Table.HeaderCell>
                <Icon name="edit" style={{ color: "#52C75F" }} />
                Operation
              </Table.HeaderCell>
            </Table.Row>
          </TableHeader>
          <Table.Body>
            {props.data &&
              props.data.list &&
              props.data.list.length > 0 &&
              props.data.list.map((e, index) => (
                <Table.Row key={e.id}>
                  <Table.Cell>
                    <a href={"/post/" + e.id}>{e.title}</a>
                  </Table.Cell>
                  <Table.Cell key={index}>
                    <Button
                      as="a"
                      color="blue"
                      secondary
                      size="tiny"
                      href={"/admin/post/edit/" + e.id}
                    >
                      Edit
                    </Button>
                    <Button
                      color="red"
                      size="tiny"
                      onClick={(ev) => {
                        props.deletePostEvent(ev, e.id);
                      }}
                    >
                      Delete
                    </Button>
                  </Table.Cell>
                </Table.Row>
              ))}
          </Table.Body>
        </Table>

        <Grid textAlign="center" style={{ marginTop: "4em" }}>
          <Grid.Row columns={1}>
            <Pagination
              totalPages={props.data.totalPage}
              firstItem={null}
              lastItem={null}
              pointing
              secondary
              activePage={reqPageNum}
              onPageChange={handlerPageChange}
            />
          </Grid.Row>
        </Grid>
      </Container>
    </>
  );
  const backToSignIn = () => {
    history.push("/admin/signIn");
  };
  const signoutEvent = () => {
    Cookies.remove("access_token");
    Cookies.remove("username");
    backToSignIn();
  };
  const { pageNum } = useParams();
  const reqPageNum = pageNum ? pageNum : 1;
  const [postData, setPostData] = useState({});
  const [madalParams, setDeleteParams] = useState({});
  const history = useHistory();
  const [signInUsername, setSignInUsername] = useState();
  const [animationShow, setAnimationShow] = useState(false);
  const WelcomeHeader = () => (
    <>
      <Container textAlign="right">
        <Header as="h2">
          Welcome,
          <span style={{ color: "green" }}>{signInUsername}</span>
        </Header>
        <Button secondary onClick={signoutEvent}>
          Signout
        </Button>
      </Container>
    </>
  );
  //Checking Cookie
  const username = Cookies.get("username");
  const accessToken = Cookies.get("access_token");
  axios.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response.status === 401) {
        backToSignIn();
      }
    }
  );
  useEffect(() => {
    if (!username && !accessToken) {
      backToSignIn();
    }
    //setSignInUsername
    setSignInUsername(username);
    axios
      .get(API.ADMIN_GET_POSTS_URL + "?page=" + reqPageNum + "&size=10", {
        withCredentials: true,
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then((res) => {
        setPostData(res.data);
        setAnimationShow(true);
      })
      .catch((e) => {
        console.error(e);
      });
  }, []);
  const handlerPageChange = (e, { activePage }) => {
    history.push("/admin/posts/page/" + activePage);
  };
  const deletePostEvent = (e, deletePostId) => {
    setDeleteParams({ open: true, deletePostId: deletePostId });
  };
  const closeModal = () => {
    setDeleteParams({ open: false, deletePostId: 0 });
  };
  const confirmDeletePostEvent = (e, deletePostId) => {
    setDeleteParams({ open: false });
    axios
      .delete(API.DELETE_BY_POST_ID + deletePostId, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then((data) => {
        history.push("/admin/posts");
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const DeleteModal = () => (
    <>
      <Modal size="mini" open={madalParams.open}>
        <Modal.Header>刪除確認</Modal.Header>
        <Modal.Content>
          <p>確定要刪除這個 Post，同時也從服務器刪除</p>
        </Modal.Content>
        <Modal.Actions>
          <Button negative onClick={closeModal}>
            否
          </Button>
          <Button
            positive
            onClick={(event) => {
              confirmDeletePostEvent(event, madalParams.deletePostId);
            }}
          >
            是
          </Button>
        </Modal.Actions>
      </Modal>
    </>
  );
  return (
    <AnimationLayout isShow={animationShow}>
      <>
        <List data={postData} deletePostEvent={deletePostEvent}></List>
        <DeleteModal />
        <Footer />
      </>
    </AnimationLayout>
  );
}

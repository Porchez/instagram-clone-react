import './App.css';
import Post from './Post';
import React, { useState, useEffect } from 'react';
import { auth, db } from './firebase';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import ImageUpload from './ImageUpload';
import Profile from './Profile';


function App() {
  const [posts, setPosts] = useState([]);
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});
  const [user, setUser] = useState(null);

  const setField = (field, value) => {
    setForm({
      ...form,
      [field]: value
    })

    if (!!errors[field]) setErrors({
      ...errors,
      [field]: null
    })
  };

  const findFormErrors = (isSignIn) => {
    const newErrors = {}
    if (isSignIn) {
      const { email, password } = form
      if (!email || email === '') newErrors.email = 'Email is required!'
      if (!password || password === '') newErrors.password = 'Password is required!'
    } else {
      const { username, email, password } = form
      if (!email || email === '') newErrors.email = 'Email is required!'
      if (!username || username === '') newErrors.username = 'Username is required!'
      if (!password || password === '') newErrors.password = 'Password is required!'
    }
    return newErrors
  };

  const handleSignIn = (event) => {
    setForm({});
    event.preventDefault();
    const newErrors = findFormErrors(true);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      const { email, password } = form;
      auth.signInWithEmailAndPassword(email, password)
        .then((authUser) => {
          setShowSignIn(false);
        })
        .catch((error) => alert(error.message));
    }
  };

  const handleSignUp = async (event) => {
    setForm({});
    event.preventDefault();
    const newErrors = findFormErrors(false);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      const { username, email, password } = form;
      await auth.createUserWithEmailAndPassword(email, password)
        .then((authUser) => {
          return authUser.user.updateProfile({
            displayName: username,
          });
        })
        .catch((error) => alert(error.message));
      setShowSignUp(false);
      window.location.reload();
    }
  };

  const switchLogIn = (event) => {
    setShowSignIn(false);
    setShowSignUp(true);
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        console.log(authUser);
        setUser(authUser);
      } else {
        setUser(null);
      }
    })
    return () => {
      unsubscribe();
    }
  }, [user]);

  useEffect(() => {
    db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id,
        post: doc.data()
      })))
    })
  }, []);

  return (
    <div className="app">
      <Modal
        id="modal-signIn"
        show={showSignIn}
        onHide={() => setShowSignIn(false)}
        centered
      >
        <Modal.Body>
          <div className="modal__login-body__image mt-4">
            <img className="header__image" src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt="" />
          </div>
          <Form onSubmit={handleSignIn} className="form__sign-up">
            <Form.Group controlId="formBasicEmail" className="mb-3 mt-3">
              <Form.Control
                type="email"
                placeholder="Email"
                onChange={e => setField('email', e.target.value)}
                isInvalid={!!errors.email}
              />
              <Form.Control.Feedback type="invalid">
                {errors.email}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="formBasicPassword" className="mb-4">
              <Form.Control
                type="password"
                placeholder="Password"
                onChange={e => setField('password', e.target.value)}
                isInvalid={!!errors.password}
              />
              <Form.Control.Feedback type="invalid">
                {errors.password}
              </Form.Control.Feedback>
            </Form.Group>
            <div>
              <Button name="button_sign_in" type="submit" variant="primary" onClick={handleSignIn} block>
                Log In
              </Button>
            </div>
            <div className="d-flex flex-row justify-content-center align-items-center mt-3">
              Don't have an account? <Button size="sm" variant="link" onClick={switchLogIn}>
                Sign Up
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal
        id="modal-signUp"
        show={showSignUp}
        onHide={() => setShowSignUp(false)}
        centered
      >
        <Modal.Body>
          <div className="modal__login-body__image mt-4">
            <img className="header__image" src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt="" />
          </div>
          <Form onSubmit={handleSignUp} className="form__sign-up">
            <Form.Group controlId="formBasicUsername" className="mb-3 mt-3">
              <Form.Control
                type="text"
                placeholder="Username"
                onChange={e => setField('username', e.target.value)}
                isInvalid={!!errors.username}
              />
              <Form.Control.Feedback type="invalid">
                {errors.username}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="formBasicEmail" className="mb-3 mt-3">
              <Form.Control
                type="email"
                placeholder="Email"
                onChange={e => setField('email', e.target.value)}
                isInvalid={!!errors.email}
              />
              <Form.Control.Feedback type="invalid">
                {errors.email}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="formBasicPassword" className="mb-4">
              <Form.Control
                type="password"
                placeholder="Password"
                onChange={e => setField('password', e.target.value)}
                isInvalid={!!errors.password}
              />
              <Form.Control.Feedback type="invalid">
                {errors.password}
              </Form.Control.Feedback>
            </Form.Group>
            <div >
              <Button id="btn-signUp" name="button_sign_up" type="submit" variant="primary" onClick={handleSignUp} block>
                Sign Up
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      <div className="header">
        <div className="container container__header">
          <img className="header__image" src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt="" />

          {user ? (
            <Button id="btn-logOut" size="sm" variant="link" onClick={() => auth.signOut()}>
              Log Out
            </Button>
          ) : (
            <Button id="btn-logIn" size="sm" variant="link" onClick={() => setShowSignIn(true)}>
              Log In
            </Button>
          )
          }
        </div>
      </div>


      <div className="container container__post">
        <Row>
          <Col>
            <div>
              {user && user.displayName ? (
                <ImageUpload username={user.displayName} photoURL={user.photoURL} />
              ) : (
                <div></div>
              )}
            </div>
            {posts.map(({ id, post }) => (
              <Post key={id} postId={id} user={user} username={post.username} caption={post.caption} imageUrl={post.imageUrl} photoURL={post.photoURL} />
            ))}
          </Col>
          <Col>
            {
              user ? (
                <Profile user={user} />
              ) : (
                <div></div>
              )
            }
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default App;

import './App.css';
import Post from './Post'
import React, { useState } from 'react'
import { Container } from 'react-bootstrap';
function App() {
  const [posts, setPosts] = useState([
    {
      username: "Chanuwat1",
      caption: "rockmanX4",
      imageUrl: "https://cf.shopee.co.th/file/6a22e9177bbfa86451b51251ff08de38"
    },
    {
      username: "Chanuwat2",
      caption: "rockmanX5",
      imageUrl: "https://www.retroplace.com/pics/ps/packshots/61047--rockman-x5.png"
    }
  ]);
  return (
    <Container>
      <div className="header">
        <img className="header__image" src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt=""></img>
      </div>

      {posts.map(post => (
        <Post username={post.username} caption={post.caption} imageUrl={post.imageUrl} />
      ))}

      {/* <Post username="Chanuwat1" caption="rockmanX4" imageUrl="https://cf.shopee.co.th/file/6a22e9177bbfa86451b51251ff08de38" />
      <Post username="Chanuwat2" caption="rockmanX4" imageUrl="https://cf.shopee.co.th/file/6a22e9177bbfa86451b51251ff08de38" />
      <Post username="Chanuwat3" caption="rockmanX4" imageUrl="https://cf.shopee.co.th/file/6a22e9177bbfa86451b51251ff08de38" /> */}
    </Container>
  );
}

export default App;

import { createContext, useContext, useState } from "react";
import { faker } from "@faker-js/faker";

//working with context api so step-1 is to create context
const PageContext = createContext();
function PostProvider({ children }) {
  function createRandomPost() {
    return {
      title: `${faker.hacker.adjective()} ${faker.hacker.noun()}`,
      body: faker.hacker.phrase(),
    };
  }

  const [posts, setPosts] = useState(() =>
    Array.from({ length: 30 }, () => createRandomPost())
  );
  const [searchQuery, setSearchQuery] = useState("");

  // Derived state. These are the posts that will actually be displayed
  const searchedPosts =
    searchQuery.length > 0
      ? posts.filter((post) =>
          `${post.title} ${post.body}`
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        )
      : posts;

  function handleAddPost(post) {
    setPosts((posts) => [post, ...posts]);
  }

  function handleClearPosts() {
    setPosts([]);
  }
  return (
    //setp-2 provide the value to the context api to be used latter
    <PageContext.Provider
      value={{
        posts: searchedPosts,
        onAddPost: handleAddPost,
        onClearPosts: handleClearPosts,
        searchQuery,
        setSearchQuery,
      }}
    >
      {children}
    </PageContext.Provider>
  );
}

function usePost() {
  const context = useContext(PageContext);
  if (context === undefined)
    throw new Error("PostContext is used outside of the PostProvider");
  return context;
}

export { PostProvider, usePost };

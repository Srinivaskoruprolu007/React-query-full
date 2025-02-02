import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { fetchPosts, deletePost, updatePost } from "./api";
import { PostDetail } from "./PostDetail";
const maxPostPage = 10;

export function Posts() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPost, setSelectedPost] = useState(null);
  const queryClient = useQueryClient();

  // replace with useQuery
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["posts", currentPage],
    queryFn: () => fetchPosts(currentPage),
    staleTime: 2000, // expiry time for the data so, after 2 seconds the data will be expired
  });
  useEffect(() => {
    if (currentPage < 11) {
      const nextPage = currentPage + 1;
      queryClient.prefetchQuery({
        queryKey: ["posts", nextPage],
        queryFn: () => fetchPosts(nextPage),
      });
    }
  }, [currentPage, queryClient]);
  if (isLoading) {
    return <h1>Loading....</h1>;
  }
  if (isError) {
    return (
      <>
        <h3>Something went wrong</h3>
        <p>{`Error is ${error}`}</p>
      </>
    );
  }

  return (
    <>
      <ul>
        {data.map((post) => (
          <li
            key={post.id}
            className="post-title"
            onClick={() => setSelectedPost(post)}
          >
            {post.title}
          </li>
        ))}
      </ul>
      <div className="pages">
        <button
          disabled={currentPage < 1}
          onClick={() => {
            setCurrentPage((currentPage) => currentPage - 1);
          }}
        >
          Previous page
        </button>
        <span>Page {currentPage + 1}</span>
        <button
          disabled={currentPage >= data.length}
          onClick={() => {
            setCurrentPage((currentPage) => currentPage + 1);
          }}
        >
          Next page
        </button>
      </div>
      <hr />
      {selectedPost && <PostDetail post={selectedPost} />}
    </>
  );
}

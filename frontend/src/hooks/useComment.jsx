import {toast} from 'react-hot-toast'
import { useQueryClient, useMutation } from '@tanstack/react-query'

const useComment = () =>{
    const queryClient = useQueryClient();
    
    const {mutate:comment , isPending,error} = useMutation({
        mutationFn : async ({ postId, text })=>{
            try{
                const res = await fetch(`/api/posts/comment/${post._id}`,{
                    method: "POST",
                    headers: {
                      "content-type": "application/json",
                    },
                    body: JSON.stringify({ text }),
                  });
                const data = await res.json()
                if(!res.ok) throw new Error(data.error)

            }catch(error){
                throw new Error(error)
            }
        },
        onSuccess: (newComment, variables) => {
            // Update the specific post's comments
            queryClient.setQueryData(["posts"], (oldData) => {
              return oldData.map(post => {
                if (post._id === variables.postId) {
                  return { ...post, comments: [...post.comments, newComment] };
                }
                return post;
              });
            });
            toast.success("Comment added!");
          },
          onError: (error) => {
            toast.error(error.message);
          }
        });
    return {comment,isPending}

}
export default useComment;
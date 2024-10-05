
import {toast} from 'react-hot-toast'
import { QueryClient,useQueryClient,useMutation } from '@tanstack/react-query'
const useUpdateProfile = (formData) =>{
    const queryClient = useQueryClient()
    const {mutateAsync:updateProfile , isPending:isUpdatingProfile} = useMutation({
		mutationFn: async ()=>{
			try{
				const res = await fetch(`/api/users/update`,{
					method:"POST",
					headers:{
						"content-type" : "application/json"
					},
					body: JSON.stringify({coverImg,profileImg})
				})
			
				const data = await res.json()
				if(!res.ok) throw new Error(data.error || "Something went wrong")
					return data
			}catch(error) {
				throw new Error(error)
			}
		},
		onSuccess:()=>{
			toast.success("Profile updated successfully")
			Promise.all([
				queryClient.invalidateQueries({queryKey:['authUser']}),
				queryClient.invalidateQueries({queryKey:['userProfile']})
			])
		},onError:()=>{
			toast.error(error)
		}
	})
return {updateProfile,isUpdatingProfile}





}
export default useUpdateProfile
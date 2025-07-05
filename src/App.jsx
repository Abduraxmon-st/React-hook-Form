import { useForm } from 'react-hook-form'
import './App.css'
import request from './services'
import { LOGIN_CREATE } from './constants'
import { toast } from 'react-toastify'
import { useEffect, useState } from 'react'

function App() {
const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm()

  const [loading, setLoading] = useState(false)
  const [loadingCard, setLoadingCard] = useState(false)
  const [loadingDelete, setLoadingDelete] = useState(false)
  const [userData, setUserData] = useState()
  const [modalOpen, setModalOpen] = useState(false)
  const [refresh, setRefresh] = useState(false)

    // User post qilish
    const handlePost = () => {
      reset({
        firstName: '',
        lastName: '',
        email: ''
      });
    setModalOpen(true);
    };

    const onSubmit = async(data) => {
      try {
        setLoading(true)
        const res = await request.post(LOGIN_CREATE, data)
        setRefresh(prev => !prev)
        setModalOpen(false)
        toast.success("User created")
        console.log(res);
        reset()
      } catch (error) {
        setLoading(false)
        console.log(error);
        toast.error("something went wrong")
      } finally {
        setLoading(false)
      }
    }

    // Userlani Get qilish
    useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingCard(true)
        const res = await request.get(LOGIN_CREATE);
        console.log(res.data);
        setUserData(res.data)
      } catch (error) {
        setLoadingCard(false)
        console.error(error);
      } finally {
        setLoadingCard(false)
      }
    };

    fetchData();
    }, [refresh]);

  // User Delete qilish
  const DeleteUser = (userId) => {
    const fetchData = async () => {
      try {
        setLoadingDelete(true)
        const res = await request.delete(`${LOGIN_CREATE}/${userId}`);        
        setUserData(prevData => prevData.filter(user => user.id !== userId))
        console.log(res.data);
        toast.success("User was deleted.")
      } catch (error) {
        setLoadingDelete(false)
        console.error(error);
        toast.error("Something went wrong")
      } finally {
        setLoadingDelete(false)
      }
    };

    fetchData();
  }

  // User put qilish ( malumotlarini ozgartirish )
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);

  const handleEdit = (user) => {
    setEditUser(user);
    reset({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email
    });
    setEditModalOpen(true);
  };

  const updateUser = async (data) => {
    try {
      setLoading(true);
      const res = await request.put(`${LOGIN_CREATE}/${editUser.id}`, data);
      
      setUserData(prevData => prevData.map(user => 
        user.id === editUser.id ? res.data : user
      ));

      toast.success("User updated");
      setEditModalOpen(false);
      setEditUser(null);
      reset();
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='container mx-auto'>
      <div className='flex justify-end px-4 py-10'>
        {/* Yangi User Qoshish buttoni */}
        <button onClick={() => handlePost()} className='flex items-center gap-2 p-2 border border-black rounded-lg'>
          New User
          <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 24 24"><path fill="currentColor" d="M12 21q-.425 0-.712-.288T11 20v-7H4q-.425 0-.712-.288T3 12t.288-.712T4 11h7V4q0-.425.288-.712T12 3t.713.288T13 4v7h7q.425 0 .713.288T21 12t-.288.713T20 13h-7v7q0 .425-.288.713T12 21" /></svg>
        </button>
      </div>

      {/* Yangi User Qoshish Modalkasi */}
      {
        modalOpen && 
        <div className='fixed top-0 left-0 w-full h-[100vh]'>
          <div onClick={() => setModalOpen(false)} className='close fixed z-90 top-0 left-0 w-full h-[100vh] bg-[#00000080]'></div>
            <form className='bg-[#fff] relative z-91 top-[50%] left-[50%] w-[350px] h-[350px] -translate-x-2/4 -translate-y-2/4 flex flex-col   justify-between p-4 rounded-2xl' onSubmit={handleSubmit(onSubmit)} action="" noValidate>
            <p className='text-4xl mt-4 text-center'>Login</p>
                <div>
                  <input className='w-full border border-gray-400 py-1 px-2 rounded' placeholder='First Name' type="text" {...register("firstName", {
                  required: "firstName hato"
                })}/>
                {
                  errors.firstName && (<p className='text-red-600'>{errors.firstName.message}</p>)
                }
                </div>
                <div>
                  <input className='w-full border border-gray-400 py-1 px-2 rounded' placeholder='Last Name' type="text" {...register("lastName", {
                  required: "lastname hato"
                })}/>
                {
                  errors.lastName && (<p className='text-red-600'>{errors.lastName.message}</p>)
                }
                </div>
                <div>
                  <input className='w-full border border-gray-400 py-1 px-2 rounded' placeholder='Email' type="email" {...register("email", {
                  required: "email hato ",
                  pattern: {
                    value: /^\S+@\S+\.\S+$/,
                    message: "invalid email"
                  }
                })}/>
                {
                  errors.email && (<p className='text-red-600'>{errors.email.message}</p>)
                }
                </div>
                <button className='flex justify-center items-center bg-black text-white py-2 rounded-xl' disabled={loading} type='submit'>{!loading? "Login": <div className='loader-button'></div>}</button>
            </form>
        </div>
      }
    
      <div>
        <p className='mb-10 text-4xl font-semibold text-center'>Users</p>
        {/* Cardlar Skeleti  */}
        {
          loadingCard && 
          <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4'>
            {
              Array.from({ length: 8 }).map((item, index) => (
                <div key={index} className='flex items-center justify-center w-full h-[290px] rounded-3xl bg-gray-100'>
                  <div className='loader-card'></div>
                </div>
              ))
            }
          </div>
        }
        
        {/* Cardlar (Userlar)*/}
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4'>
          {
            userData?.map((item, index) => (
              <div key={index} className='flex flex-col gap-4 w-full p-4 border border-black rounded-3xl text-xl'>
                <div>
                  <p className='text-lg text-gray-500'>first name:</p>
                  <p className='line-clamp-1'>{item.firstName}</p>
                </div>
                <div>
                  <p className='text-lg text-gray-500'>last name:</p>
                  <p className='line-clamp-1'>{item.lastName}</p>
                </div>
                <div>
                  <p className='text-lg text-gray-500'>email:</p>
                <p className='line-clamp-1'>{item.email}</p>
                </div>

                <div className='flex items-center justify-end gap-6'>
                  <button onClick={() => handleEdit(item)} className='p-1 rounded-xl border-2 border-black'>
                    <svg xmlns="http://www.w3.org/2000/svg" width={32} height={32} viewBox="0 0 24 24"><path fill="currentColor" d="M5 21q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h8.925l-2 2H5v14h14v-6.95l2-2V19q0 .825-.587 1.413T19 21zm4-6v-4.25l9.175-9.175q.3-.3.675-.45t.75-.15q.4 0 .763.15t.662.45L22.425 3q.275.3.425.663T23 4.4t-.137.738t-.438.662L13.25 15zM21.025 4.4l-1.4-1.4zM11 13h1.4l5.8-5.8l-.7-.7l-.725-.7L11 11.575zm6.5-6.5l-.725-.7zl.7.7z" /></svg>
                  </button>
                  <button onClick={() => DeleteUser(item.id)} className='p-1 rounded-xl border-2 border-black'>
                    <svg xmlns="http://www.w3.org/2000/svg" width={32} height={32} viewBox="0 0 24 24"><path fill="currentColor" d="M7 21q-.825 0-1.412-.587T5 19V6H4V4h5V3h6v1h5v2h-1v13q0 .825-.587 1.413T17 21zM17 6H7v13h10zM9 17h2V8H9zm4 0h2V8h-2zM7 6v13z" /></svg>
                  </button>
                </div>
              </div>
            ))
          }
        </div>

        {/* Edit qilish modal */}
        {
        editModalOpen && (
          <div className='fixed top-0 left-0 w-full h-[100vh]'>
            <div onClick={() => setEditModalOpen(false)} className='fixed z-90 top-0 left-0 w-full h-[100vh] bg-[#00000080]'></div>
            
            <form 
              className='bg-[#fff] relative z-91 top-[50%] left-[50%] w-[350px] h-[350px] -translate-x-2/4 -translate-y-2/4 flex flex-col justify-between p-4 rounded-2xl' 
              onSubmit={handleSubmit(updateUser)}
              noValidate
            >
              <p className='text-4xl mt-4 text-center'>Edit User</p>
              <div>
                <input 
                  className='w-full border border-gray-400 py-1 px-2 rounded' 
                  placeholder='First Name' 
                  defaultValue={editUser?.firstName} 
                  type="text" 
                  {...register("firstName", { required: "firstName hato" })}
                />
                {errors.firstName && <p className='text-red-600'>{errors.firstName.message}</p>}
              </div>
              <div>
                <input 
                  className='w-full border border-gray-400 py-1 px-2 rounded' 
                  placeholder='Last Name' 
                  defaultValue={editUser?.lastName} 
                  type="text" 
                  {...register("lastName", { required: "lastName hato" })}
                />
                {errors.lastName && <p className='text-red-600'>{errors.lastName.message}</p>}
              </div>
              <div>
                <input 
                  className='w-full border border-gray-400 py-1 px-2 rounded' 
                  placeholder='Email' 
                  defaultValue={editUser?.email} 
                  type="email" 
                  {...register("email", { 
                    required: "email hato", 
                    pattern: { value: /^\S+@\S+\.\S+$/, message: "invalid email" } 
                  })}
                />
                {errors.email && <p className='text-red-600'>{errors.email.message}</p>}
              </div>
              <button 
                className='flex justify-center items-center bg-black text-white py-2 rounded-xl' 
                disabled={loading} 
                type='submit'
              >
                {!loading ? "Save" : <div className='loader-button'></div>}
              </button>
            </form>
          </div>
        )
        }

        {/* Ochirish Loading */}
        {
          loadingDelete && 
          <div className='fixed flex justify-center items-center w-full h-[100vh] top-2/4 left-2/4 -translate-x-2/4 -translate-y-2/4 bg-[#ffffff81]'>
            <div className=' loader-card'></div>
          </div>
        }
      </div>
      
    </div>
  )
}

export default App

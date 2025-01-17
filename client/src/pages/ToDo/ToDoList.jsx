import React, { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar'
import { Button, Divider, Empty, Input, message, Modal, Select, Tag, Tooltip } from 'antd'
import { getErrorMessage } from '../../util/GetError';
import { getUserDetails } from '../../util/GetUser';
import ToDoServices from '../../Services/toDoServices';
import { Navigate } from 'react-router';
import {CheckCircleFilled, DeleteOutlined, EditOutlined} from '@ant-design/icons'
import styles from './todolist.css'

function ToDoList() {
  const[title, setTitle] = useState("");
  const[description, setDescription] = useState("");
  const[isAdding, setisAdding] = useState(false);
  const [loading, setLoading]=useState(false);
  const [allToDo, setAllToDo]=useState([]);

  const [currentEditItem, setCurrentEditItem]=useState("");
  const [isEditing, setIsEditing]=useState(false);
  const [updatedTitle, setUpdatedTitle]=useState("");
  const [updatedDescription, setUpdatedDescription]=useState("");
  const [updatedStatus, setUpdatedStatus]=useState(false);

  const [currentTaskType, setCurrentTaskType] = useState("All");

  const[completedToDo, setCompletedToDo]=useState([]);
  const[incompletedToDo, setIncompletedToDo]=useState([]);
  const[currentTodoTask, setCurrentTodoTask]=useState([]);

  const[filterToDo, setFilterToDo] = useState([]);



  let user =getUserDetails();
  const getAllToDo=async()=>{
    try {
      const response = await ToDoServices.getAllToDo(user?.userId);
      console.log(response.data);
      setAllToDo(response.data);
    } catch (error) {
      console.log(error);
      message.error(getErrorMessage(error));
      
    }
  }

  useEffect(()=>{
    let user =getUserDetails();

    const getAllToDo=async()=>{
      try {
        const response = await ToDoServices.getAllToDo(user?.userId);
        setAllToDo(response.data);
      } catch (error) {
        console.log(error);
        message.error(getErrorMessage(error));
      }
    }
    if(user && user?.userId){
      getAllToDo();
    }
    else{
      Navigate('/login');
    }
  },[Navigate]);

  useEffect(()=>{
    const incomplete=allToDo.filter((item)=>item.isCompleted===false);
    const complete=allToDo.filter((item)=>item.isCompleted===true);

    setCompletedToDo(complete);
    setIncompletedToDo(incomplete);
    if(currentTaskType==='Incomplete'){
      setCurrentTodoTask(incomplete);
    }
    else if(currentTaskType==='Complete'){
      setCurrentTodoTask(complete);
    }
    else setCurrentTodoTask(allToDo);

  },[allToDo])

  const hanldeSubmitTask=async()=>{

    try {
      const userId=getUserDetails()?.userId;
      const data={title, description, isCompleted:false, createdBy:userId};
      console.log(data);
      
      const response=await ToDoServices.createToDo(data);

      console.log(response.data);

      message.success("To Do Task Added Successfully")
      setisAdding(false)
      setLoading(false);
      getAllToDo();
    } catch (err) {
      console.log(err);
      message.error(getErrorMessage(err));
      setisAdding(false);
      setLoading(false);

    }
  }

  const handleEdit=(item)=>{
    setCurrentEditItem(item);
    setIsEditing(true);
    setUpdatedTitle(item?.title);
    setUpdatedDescription(item?.description);
    setUpdatedStatus(item?.isCompleted);
    console.log("Edit");
    
  }

  const handleDelete=async(value)=>{
    try {
      const response= await ToDoServices.deleteToDo(value._id);
      console.log(response);
      message.success(`${value.title} Deleted Successfully`);
      console.log("Delete");
      getAllToDo();
    } catch (error) {
      console.log(error);
      message.error(getErrorMessage(error));
      setLoading(false);
    }
    
    
  }
  const handleUpdateStatus=async(id, status)=>{
    try {
      setLoading(true);
      
      const response = await ToDoServices.updateToDo(id, {isCompleted:status});
      message.success(`Updated`);
      setIsEditing(false);
      setLoading(false);
      getAllToDo();

      
    } catch (error) {
      console.log(error);
      message.error(getErrorMessage(error));
      setLoading(false);

      
    }
    
  }

  const getFormattedDate=(value)=>{
    let date=new Date(value);
    let dateString = date.toDateString();
    let hh=date.getHours();
    let min = date.getMinutes();
    let ss=date.getSeconds();
    let finalDate=`${dateString} at ${hh}:${min}:${ss}`;
    return finalDate;
  }

  const hanldeUpdateTask=async()=>{
    try {
      setLoading(true);
      const data={
        title:updatedTitle,
        description:updatedDescription,
        isCompleted:updatedStatus
      };
      // console.log(data);
      const response = await ToDoServices.updateToDo(currentEditItem?._id, data);
      message.success(`${currentEditItem.title} Updated Successfully`);
      setIsEditing(false);
      setLoading(false);
      getAllToDo();

      
    } catch (error) {
      console.log(error);
      message.error(getErrorMessage(error));
      setLoading(false);

      
    }
  }

  const handleTypeChange=(value)=>{
    console.log(value);
    setCurrentTaskType(value);
    if(value==='Incomplete'){
      setFilterToDo([]);

      setCurrentTodoTask(incompletedToDo);
    }
    else if(value==='Complete'){
      setFilterToDo([]);
      setCurrentTodoTask(completedToDo);
    }
    else{
      setFilterToDo([]);

      setCurrentTodoTask(allToDo);
    }

  }

  const handleSearch=(e)=>{

    console.log(filterToDo);
    
    let query=e.target.value;
    let filterdList = allToDo.filter((item)=>{
      const titleMatches = item.title.toLowerCase().includes(query.toLowerCase());
    return titleMatches ;
    });

console.log(filterdList + "Filtered");

    if(filterdList.length>0 ){
      setFilterToDo(filterdList);
    }
    else{
      setFilterToDo([]);
    }
    
  }


  return (
    <div>
      <Navbar active={"myTask"}/>
      <section >
        <div className='header'>
          <h2>Your Tasks</h2>
          <Input style={{width:'50%'}} onChange={handleSearch} placeholder='Search Your Task Here....'></Input>
          <div>
            <Button onClick={()=>setisAdding(true)} type='primary' size='large'>Add task</Button>
            <Select
            value={currentTaskType}
            style={{width:`130px`, marginLeft:`10px`}}
              onChange={handleTypeChange}
              size='large'
              options={[
                {value:'All', label:'All'},
                {value:'Incomplete', label:'Incomplete'},
                {value:'Complete', label:'Complete'}
              ]}
            />
          </div>
        </div>
        <Divider></Divider>

        <div className='cards-todo'>{
          (filterToDo.length>0)?
          filterToDo.map((item)=>{
          return (
            <div key={item?._id} className='card'>
              <div className='card-head'>
              <h1>{item.title}</h1>
              {item?.isCompleted? <Tag color='cyan'>Completed</Tag>:<Tag color='Red'>Incomplete</Tag>}
              </div>
              <p>{item?.description}</p>
              
              <div className='card-footer'>
                <Tag>{getFormattedDate(item?.createdAt)}</Tag>
                <div className='footer-icon'>
                <Tooltip title="Edit Task">
                  <EditOutlined onClick={()=>{handleEdit(item)}}>
                  </EditOutlined>
                </Tooltip>
                <Tooltip title="Delete Task">
                  <DeleteOutlined style={{color:"red"}} onClick={()=>{handleDelete(item)}}>
                  </DeleteOutlined>
                </Tooltip>
                {item?.isCompleted? <Tooltip title="Mark as Incomplete">
                  <CheckCircleFilled style={{color:"green"}} onClick={()=>{handleUpdateStatus(item._id, false)}}>
                  </CheckCircleFilled>
                </Tooltip>:<Tooltip title="Mark as Complete">
                  <CheckCircleFilled style={{color:"red"}} onClick={()=>{handleUpdateStatus(item._id, true)}}>
                  </CheckCircleFilled>
                </Tooltip>}
                </div>
                
              </div>
            </div>
          )
        }):(currentTodoTask.length>0)?
        currentTodoTask.map((item)=>{
          return (
            <div key={item?._id} className='card'>
              <div className='card-head'>
              <h1>{item.title}</h1>
              {item?.isCompleted? <Tag color='cyan'>Completed</Tag>:<Tag color='Red'>Incomplete</Tag>}
              </div>
              <p>{item?.description}</p>
              
              <div className='card-footer'>
                <Tag>{getFormattedDate(item?.createdAt)}</Tag>
                <div className='footer-icon'>
                <Tooltip title="Edit Task">
                  <EditOutlined onClick={()=>{handleEdit(item)}}>
                  </EditOutlined>
                </Tooltip>
                <Tooltip title="Delete Task">
                  <DeleteOutlined style={{color:"red"}} onClick={()=>{handleDelete(item)}}>
                  </DeleteOutlined>
                </Tooltip>
                {item?.isCompleted? <Tooltip title="Mark as Incomplete">
                  <CheckCircleFilled style={{color:"green"}} onClick={()=>{handleUpdateStatus(item._id, false)}}>
                  </CheckCircleFilled>
                </Tooltip>:<Tooltip title="Mark as Complete">
                  <CheckCircleFilled style={{color:"red"}} onClick={()=>{handleUpdateStatus(item._id, true)}}>
                  </CheckCircleFilled>
                </Tooltip>}
                </div>
                
              </div>
            </div>
          )
        }):
        allToDo.map((item)=>{
          return (
            <div key={item?._id} className='card'>
              <div className='card-head'>
              <h1>{item.title}</h1>
              {item?.isCompleted? <Tag color='cyan'>Completed</Tag>:<Tag color='Red'>Incomplete</Tag>}
              </div>
              <p>{item?.description}</p>
              
              <div className='card-footer'>
                <Tag>{getFormattedDate(item?.createdAt)}</Tag>
                <div className='footer-icon'>
                <Tooltip title="Edit Task">
                  <EditOutlined onClick={()=>{handleEdit(item)}}>
                  </EditOutlined>
                </Tooltip>
                <Tooltip title="Delete Task">
                  <DeleteOutlined style={{color:"red"}} onClick={()=>{handleDelete(item)}}>
                  </DeleteOutlined>
                </Tooltip>
                {item?.isCompleted? <Tooltip title="Mark as Incomplete">
                  <CheckCircleFilled style={{color:"green"}} onClick={()=>{handleUpdateStatus(item._id, false)}}>
                  </CheckCircleFilled>
                </Tooltip>:<Tooltip title="Mark as Complete">
                  <CheckCircleFilled style={{color:"red"}} onClick={()=>{handleUpdateStatus(item._id, true)}}>
                  </CheckCircleFilled>
                </Tooltip>}
                </div>
                
              </div>
            </div>
          )
        })} </div>

        <Modal confirmLoading={loading} title="Add New To Do Task" open={isAdding} onOk={hanldeSubmitTask} onCancel={()=>setisAdding(false)}>
          <Input placeholder='Title' value={title} onChange={(e)=>setTitle(e.target.value)}></Input>
          <Input.TextArea placeholder='Description' value={description} type="description"onChange={(e)=>setDescription(e.target.value)}/>
        </Modal>


        <Modal confirmLoading={loading} title={`Update ${currentEditItem.title}`} open={isEditing} onOk={hanldeUpdateTask} onCancel={()=>setIsEditing(false)}>
          <Input placeholder='Updated Title' value={updatedTitle} onChange={(e)=>setUpdatedTitle(e.target.value)}></Input>
          <Input.TextArea placeholder='Updated Description' value={updatedDescription} type="description"onChange={(e)=>setUpdatedDescription(e.target.value)}/>
          <Select
            onChange={(value)=>setUpdatedStatus(value)}
            value={updatedStatus}
            options={[
              {
                value:false,
                label:'Not Completed'
              },
              {
                value:true,
                label:'Completed'
              }
            ]}
          ></Select>
        </Modal>
      </section>
    </div>
  )
}

export default ToDoList
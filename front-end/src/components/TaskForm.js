import {useState, useEffect, useRef} from "react";
import {useDispatch, useSelector}	from 'react-redux';
import {useNavigate, useParams, Link} from 'react-router-dom';
import {v4 as uuid} from 'uuid';
import {addTask, editTask} from '../features/tasks/taskSlice';

function	TaskForm()
{
	const	[task, setTask] = useState({
		title: '',
		description: ''
	});
	const	dispatch = useDispatch();
	const	navigate = useNavigate();
	const	params = useParams();
	const	tasks = useSelector(state => state.tasks);
  	const	videoRef = useRef(null);
	const	streamRef = useRef(null);

	const handleKeyDown = (e) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			handleSubmit(e);
		}
	};
	
	const	handleChange = e => {
		setTask({
			...task,
			[e.target.name]: e.target.value,
		})
	};

	const	handleSubmit = e => {
		e.preventDefault();
		if (params.id)
		{
			dispatch(editTask(task));
		}
		else
		{
			dispatch(addTask({
				...task,
				id: uuid(),
				}));
		}
		navigate('/');
	};

	useEffect(() => {
		if (params.id)
		{
			setTask(tasks.find(task => task.id === params.id));
		}
	}, [params.id, tasks]);

	useEffect(() => {
		let video = videoRef.current;
		navigator.mediaDevices.getUserMedia({ video: true })
		  .then(stream => {
			streamRef.current = stream;
			video.srcObject = stream;
			video.addEventListener('loadedmetadata', () => {
				video.play();
			})
		  })
		  .catch(err => {
			console.error("Error accessing webcam: ", err);
		  });
		  return () => {
			if (streamRef.current) {
				streamRef.current.getTracks().forEach(track => track.stop());
			}
		  };
	  }, []);

	return (
		<div>
		<header>
			<h1>Create Ticket</h1>
		</header>
		<form onSubmit={handleSubmit} className="bg-zinc-800 max-w-sm p-4 mb-4">
			<label htmlFor="title" className="block text-xm font-bold mb-2">Task</label>
			<input 
				name="title"
				type="text"
				placeholder="Ticket title"
				onChange={handleChange}
				value={task.title}
				className="w-full p-2 rounded-md bg-zinc-600 mb-2"
			/>
			<label htmlFor="description" className="block text-xm font-bold mb-2">Description</label>
			<textarea
				name="description"
				placeholder="Ticket description"
				onChange={handleChange}
				value={task.description}
				onKeyDown={handleKeyDown}
				className="w-full p-2 rounded-md bg-zinc-600 mb-2"
			/>
			<label htmlFor="video" className="block text-xm font-bold mb-2">Photo</label>
		  	<video
				ref={videoRef}
				className="w-full h-48 bg-black rounded-md"
				controls
		  	/>
			<button className="bg-green-600 px-2 py-1 mt-4 rounded-sm">Save</button>
		</form>
			<Link to='/' className="bg-indigo-600 px-2 py-1 rounded-sm text-sm">
				Ticket List
			</Link>
		</div>
	);
}

export default TaskForm;
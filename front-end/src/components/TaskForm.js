import {useState, useEffect} from "react";
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
	}, []);

	return (
		<div>
		<header>
			<h1>Create Ticket</h1>
		</header>
		<form onSubmit={handleSubmit}>
			<input 
				name="title"
				type="text"
				placeholder="Ticket title"
				onChange={handleChange}
				value={task.title}
			/>
			<textarea
				name="description"
				placeholder="Ticket description"
				onChange={handleChange}
				value={task.description}
				onKeyDown={handleKeyDown}
			/>
			<button>Save</button>
		</form>
		<Link to='/'>
			Ticket List
		</Link>
		</div>
	);
}

export default TaskForm;
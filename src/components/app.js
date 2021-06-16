import React, {Component} from 'react';

// Bootstrap for react
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import ListGroup from 'react-bootstrap/ListGroup';
import Form from 'react-bootstrap/Form'
import Dropdown from 'react-bootstrap/Dropdown'
import DropdownButton from 'react-bootstrap/DropdownButton'
import {AddToDoAPI, GetToDoListAPI, UpdateToDoAPI, DeleteToDoAPI} from '../api/to-do'
import { BsStop } from 'react-icons/bs';

class AppComponent extends Component {
	constructor(props) {
		super(props);

		// Setting up state
		this.state = {
			userInput : "",
			list:[],
			selectedTag: "Other",
			selectedTagColor: "grey",
			tags: [
				{tagName: 'Other', color: 'grey'},
				{tagName: 'Work', color: 'Red'},
				{tagName: 'Personal', color: 'green'}
			]
		}
	}
	componentDidMount() {
		this.getItems()
	}

	// Set a user input value
	updateInput(value){
		this.setState({
			userInput: value,
		});
	}

	// Set a selected tag value
	updateTag(value){
		this.setState({
			selectedTag: value.split(" ")[0],
			selectedTagColor: value.split(" ")[1]
		});
	}

	// Add item if user input in not empty
	addItem(event){
		if(event.code === 'Enter') {
			debugger
			AddToDoAPI({text: this.state.userInput, tag: this.state.selectedTag, tagColor: this.state.selectedTagColor}).then(resp => {
				if(!localStorage.userId) {
					localStorage.setItem('userId', resp.data._id);
				}
				this.getItems()
			})
		}
	}
	getItems() {
		GetToDoListAPI().then(resp => {
			// Update list
			const list = [...resp.docs[0] ? resp.docs[0].toDos : []];
			// reset state
			this.setState({
				list,
				userInput: ""
			});
		})
	}

	UpdateToDo(val, id) {
		UpdateToDoAPI({done: val}, id).then(resp => {
			this.getItems()
		})
	}

	// Function to delete item from list use id to delete
	deleteItem(id) {
		DeleteToDoAPI(id).then(resp => {
			this.getItems()
		})
	}

	render(){
		return(
		<Container>

			<Row style={{
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				fontSize: '3rem',
				fontWeight: 'bolder',
				fontFamily: 'DejaVu Sans Mono, monospace',
				paddingTop: 2
				}}
				>TODO LIST
			</Row>
			<hr style={{marginTop: 0}}/>
			<Row>
				<Col md={{ span: 5, offset: 4 }}>

					<InputGroup className="mb-3">
					<DropdownButton
							variant="outline-secondary"
							id="input-group-dropdown-2"
							title={this.state.selectedTag}
							align="end"
							size="lg"
							style={{backgroundColor: 'white'}}
							onSelect = {e => this.updateTag(e)}
							>
								{this.state.tags.map(tag => (
									<span style={{display: 'flex'}}><BsStop style={{fontSize: 30, marginTop: 1, color: tag.color}}/><Dropdown.Item key={tag.tagName} eventKey={tag.tagName + ' ' + tag.color}>{tag.tagName}</Dropdown.Item></span>
								))}
						</DropdownButton>
						<FormControl
							placeholder="add item . . . "
							size="lg"
							value = {this.state.userInput}
							onChange = {item => this.updateInput(item.target.value)}
							onKeyPress = {e => this.addItem(e)}
							aria-label="add something"
							aria-describedby="basic-addon2"
						/>
						{/* <InputGroup.Append>
							<Button
							variant="dark"
							size="lg"
							onClick = {()=>this.addItem()}
							>
							ADD
							</Button>
						</InputGroup.Append> */}
					</InputGroup>
				</Col>
			</Row>
			<Row>
				<Col md={{ span: 5, offset: 4 }}>
					<ListGroup>
					{/* map over and print items */}
					{this.state.list.map(item => {return(
						
						<ListGroup.Item variant="white" action
							 key={item._id}>
							<Form.Group id="formGridCheckbox" style={{display: 'flex'}}>
							<Form.Check type="checkbox" style={{width: 10}} className="my-1 mr-sm-2" onChange={e => this.UpdateToDo(!item.done, item._id)} checked={item.done}/>
							{item.done ? <span style={{textDecoration: 'line-through', marginTop: 5, width: 380}}>{item.toDo}</span> : <span style={{marginTop: 5, width: 380}}>{item.toDo}</span>}
							<BsStop style={{fontSize: 30, marginTop: 1, color: item.tagColor, float: 'right', width: 30}}/>
							<Button
								variant="secondary"
								size="sm"
								onClick = { () => this.deleteItem(item._id) }
								style={{float: 'right', borderRadius: '40%', marginLeft: 'auto', width: 30}}
								>
								X
							</Button>		
							</Form.Group>
						</ListGroup.Item>

					)})}
					</ListGroup>
				</Col>
			</Row>
		</Container>
		);
	}
}

export default AppComponent;

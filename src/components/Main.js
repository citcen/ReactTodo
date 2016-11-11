require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';
import ReactDOM from 'react-dom';

class TODOHeader extends React.Component {

    //监听键盘回车键keyCode
    handleKeyUp(e) {
        if (e.keyCode === 13) {

            let todoText = e.target.value;
            if (!todoText) return false;

            let newItem = {
                text: todoText,
                isDone: false
            };
            this.props.addTodo(newItem);
            e.target.value = '';
        }
        e.stopPropagation();
    }

    render() {
        return (
            <div className='todo-header'>
                <input type='text' onKeyUp={(e) => this.handleKeyUp(e)} placeholder='请输入您的待办任务，回车确认'/>
            </div>
        )
    }
}

class TODOList extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        if (this.props.todoItems.length == 0) {
            return (
                <div className='todo-empty'>等待您来添加待办任务！</div>
            )
        } else {
            return (
                <ul className='todo-list'>
                    {
                        this.props.todoItems.map((todoItem, index) => {
                            //{...this.props} 用来传递TodoList的todos属性和remove、change方法。
                            return <TODOItem todoItem={todoItem} key={index} index={index} {...this.props}/>
                        })
                    }
                </ul>
            )
        }
    }
}

class TODOItem extends React.Component {
    constructor(props) {
        super(props);
    }

    //input改变
    handleOnChange(e) {
        let isDone = !this.props.todoItem.isDone;
        this.props.changeTodoState(this.props.index, isDone);
        e.stopPropagation();
    }

    //鼠标移入
    handleMouseOver(e) {
        ReactDOM.findDOMNode(this.refs.delButton).style.display = 'inline-block';
        e.stopPropagation();
    }

    //鼠标移出
    handleMouseOut(e) {
        ReactDOM.findDOMNode(this.refs.delButton).style.display = 'none';
        e.stopPropagation();
    }

    //点击删除
    clickRemove(e) {
        this.props.removeTodo(this.props.index);
        e.stopPropagation();
    }

    render() {
        let todoTextClassName = this.props.todoItem.isDone ? 'task-done' : '';

        return (
            <li className='todo-item .clearfix' onMouseOver={(e) => this.handleMouseOver(e)}
                onMouseOut={(e) => this.handleMouseOut(e)}>
                <input type='checkbox' checked={this.props.todoItem.isDone} onChange={(e) => this.handleOnChange(e)}/>
                <span className={todoTextClassName}>{this.props.todoItem.text}</span>
                <button className="fr" ref='delButton' type='button' onClick={(e) => this.clickRemove(e)}>删除</button>
            </li>
        )
    }
}

class TODOFooter extends React.Component {

    //删除已完成
    handleClick(e) {
        this.props.clearTodo();
        e.stopPropagation();
    }

    //input选择
    handleOnChange(e) {
        this.props.changeTodoState(null, !this.props.isAllChecked, true);
        e.stopPropagation();
    }

    render() {
        return (
            <div className="todo-footer">
                <input type='checkbox' checked={this.props.isAllChecked} onChange={(e) => this.handleOnChange(e)}/>
                <span>
                    {this.props.todoDoneCount}已完成/
                    总数{this.props.todoCount}
                </span>
                <button onClick={(e) => this.handleClick(e)} type='button' className="fr">清楚已完成</button>
            </div>
        )
    }
}

class AppComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            todos: [],
            isAllChecked: false
        }
    }

    //判断是否所有任务的状态都完成，同步todo-footer的全选框
    allChecked() {
        let isAllChecked = false;
        if (this.state.todos.every((todo) => todo.isDone)) {
            isAllChecked = true;
        }
        this.setState({
            isAllChecked: isAllChecked
        })
    }

    //添加任务，传递给todo-header
    addTodo(todoItem) {
        let todos = this.state.todos;
        todos.push(todoItem);
        this.setState({
            todos: todos
        })
    }

    // 改变任务状态，传递给todo-item和todo-footer组件的方法
    changeTodoState(index, isDone, isChangeAll = false) {
        if (isChangeAll) {
            this.setState({
                todos: this.state.todos.map((todo) => {
                    todo.isDone = isDone;
                    return todo;
                }),
                isAllChecked: isDone
            })
        } else {
            this.state.todos[index].isDone = isDone;
            this.allChecked();
        }
    }

    //删除当前任务 ，传递给todo-item
    removeTodo(index) {
        this.state.todos.splice(index, 1);
        this.setState({
            todos: this.state.todos
        })
    }

    //删除选定todo
    clearTodo() {
        let todos = this.state.todos.filter((todo) => !todo.isDone);
        this.setState({
            todos: todos
        })
    }

    render() {
        let todoNum = {
            todoCount: this.state.todos.length || 0,
            todoDoneCount: this.state.todos.filter((todo) => todo.isDone).length || 0
        };

        return (
            <div className='todo-content'>
                <TODOHeader addTodo={this.addTodo.bind(this)}/>
                <TODOList todoItems={this.state.todos} removeTodo={this.removeTodo.bind(this)}
                          changeTodoState={this.changeTodoState.bind(this)}/>
                <TODOFooter allChecked={this.allChecked.bind(this)} isAllChecked={this.state.isAllChecked}
                            clearTodo={this.clearTodo.bind(this)}
                            changeTodoState={this.changeTodoState.bind(this)} {...todoNum}/>
            </div>
        );
    }
}

AppComponent.defaultProps = {
    todos: React.PropTypes.arrayOf(
        React.PropTypes.shape({
            text: React.PropTypes.string.isRequired,
            isDone: React.PropTypes.bool
        })
    ),
    isAllChecked: React.PropTypes.bool
};

export default AppComponent;

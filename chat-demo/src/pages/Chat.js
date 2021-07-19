

import React, { Component } from "react";
import { auth } from "../services/firebase";
import { db } from "../services/firebase";
import { Fragment } from 'react'
import { Popover, Transition } from '@headlessui/react'
import Settings from "../components/Settings";
import ProfileNav from "../components/ProfileNav";
import Modal from "../components/Modal";
import {
  MenuIcon,
  XIcon,
} from '@heroicons/react/outline'
import Footer from "../components/Footer";
let Filter = require('bad-words');
let filter = new Filter();
let dateFormat = require("dateformat");
const devUID = 'DTlkEX32dzQkyLXHufyLr8EVYxh1';
export default class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: auth().currentUser,
      chats: [],
      content: '',
      readError: null,
      writeError: null,
      loadingChats: false,
      open: false,
      modal: true,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.update = this.update.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.myRef = React.createRef();
  }

  async componentDidMount() {
    this.setState({ readError: null, loadingChats: true });
    const chatArea = this.myRef.current;
    try {
      db.ref("chats").on("value", snapshot => {
        let chats = [];
        snapshot.forEach((snap) => {
          chats.push(snap.val());
        });
        chats.sort(function (a, b) { return a.timestamp - b.timestamp })
        this.setState({ chats });
        chatArea.scrollBy(0, chatArea.scrollHeight);
        this.setState({ loadingChats: false });
      });
    } catch (error) {
      this.setState({ readError: error.message, loadingChats: false });
    }
  }


  handleChange(event) {
    this.setState({
      content: event.target.value
    });
  }

  async handleSubmit(event) {
    event.preventDefault();
    this.setState({ writeError: null });
    const chatArea = this.myRef.current;
    try {
      await db.ref("chats").push({
        content: filter.clean(this.state.content),
        timestamp: Date.now(),
        uid: this.state.user.uid,
        profileSrc: this.state.user.photoURL,
        userName: this.state.user.displayName
      });
      this.setState({ content: '' });
      chatArea.scrollBy(0, chatArea.scrollHeight);
    } catch (error) {
      this.setState({ writeError: error.message });
    }
  }

  formatTime(timestamp) {
    const now = new Date(timestamp);
    const time = dateFormat(now, "mmmm dS, yyyy h:MM TT");
    return time;
  }
  update(status) {
    this.setState({ open: status })
  }
  closeModal() {
    this.setState({modal: false})
  }
  async updateUser(name, url) {
    await auth().currentUser.updateProfile({
      displayName: name,
      photoURL: url
    })
  }
  classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }

  render() {
    return (
      <div className="h-screen bg-white scrollbar-hide">
        <Modal {...this.state} update={this.closeModal}/>
        <Settings {...this.state} update={this.update} updateProfile={this.updateUser} />
        <Popover className="relative bg-white shadow">
          {({ open }) => (
            <>
              <div className=" max-w-6xl mx-auto sm:px-6">
                <div className="flex justify-between items-center py-2 md:justify-start md:space-x-10">
                  <div className="flex justify-start lg:w-0 lg:flex-1">
                    <a href="/">
                      <span className="sr-only">Chatty</span>
                      <h1 className="text-4xl tracking-tight font-extrabold sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl text-indigo-700 xl:inline">Chatty</h1>
                    </a>
                  </div>
                  <div className="-mr-2 -my-2 md:hidden">
                    <Popover.Button className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                      <span className="sr-only">Open menu</span>
                      <MenuIcon className="h-6 w-6" aria-hidden="true" />
                    </Popover.Button>
                  </div>
                  <div className="hidden md:flex items-center justify-end md:flex-1 lg:w-0">

                    <ProfileNav {...this.state} update={this.update} />
                  </div>

                </div>
              </div>

              <Transition
                show={open}
                as={Fragment}
                enter="duration-200 ease-out"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="duration-100 ease-in"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Popover.Panel
                  focus
                  static
                  className="absolute top-0 inset-x-0 z-10 p-2 transition transform origin-top-right md:hidden"
                >
                  <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 bg-white divide-y-2 divide-gray-50">
                    <div className="pt-4 pb-4 px-5">
                      <div className="flex items-center justify-between">
                        <div>
                          <a href="/"><h1 className="text-4xl tracking-tight font-extrabold sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl text-indigo-600 xl:inline">Chatty</h1></a>
                        </div>
                        <div className="-mr-2">

                          <Popover.Button className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                            <span className="sr-only">Close menu</span>
                            <XIcon className="h-6 w-6" aria-hidden="true" />
                          </Popover.Button>
                        </div>
                      </div>
                      <div>
                        
                        <button
                          onClick={() => this.update(true)}
                          className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium mt-3 text-white bg-indigo-600 hover:bg-indigo-700"
                        >
                          Settings
                        </button>
                        <button
                          onClick={() => auth().signOut()}
                          className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium mt-3 text-white bg-indigo-600 hover:bg-indigo-700"
                        >
                          Log out
                        </button>

                      </div>

                    </div>
                  </div>
                </Popover.Panel>
              </Transition>
            </>
          )}
        </Popover>


        <div className="xl:w-3/5 mx-auto py-1 px-2 h-3/4 overflow-y-scroll scrollbar-hide bg-gray-50" ref={this.myRef}>
          {/* loading indicator */}
          {this.state.loadingChats ? <div className="spinner-border text-success" role="status">
            <span className="sr-only">Loading...</span>
          </div> : ""}
          {/* chat area */}
          {this.state.chats.map(chat => {
            return (
              <div className={"text-2xl tracking-tight text-white rounded-3xl p-6 m-5 max-w-lg break-words" + (this.state.user.uid === chat.uid ? " bg-indigo-700 ml-auto" : " bg-gray-700 mr-auto")}>
                <p className="text-base text-white mb-3 "><span><img className="mr-2 float-left rounded-full h-9 w-9 object-cover bg-white" alt="" src={chat.profileSrc}></img></span><span className={"font-bold text-xs text-blue-700 bg-gray-100 rounded mr-1 " + (chat.uid === devUID ? "px-1" : null )}>{chat.uid === devUID ? 'dev' : null} </span>{chat.userName}</p>
                <p>{chat.content}</p>
                <p className="text-sm tracking-tight text-white float-right">{this.formatTime(chat.timestamp)}</p>
              </div>
            )
          })}
        </div>
        <div className="">
          <div className="bg-white rounded-lg xl:w-3/5 xl:mx-auto">
            <div>
              <form onSubmit={this.handleSubmit}>
                <label for="chat" className="text-gray-700 text-sm font-medium">Send a message</label>
                <input id="chat" required className="form-control  rounded-lg  w-full  h-14" name="content" onChange={this.handleChange} type="text" value={this.state.content}></input>
                {this.state.error ? <p className="text-danger">{this.state.error}</p> : null}
              </form>
            </div>
          </div>
        </div>
        <Footer />
      </div>

    );
  }
}

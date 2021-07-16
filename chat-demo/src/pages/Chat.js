import React, { Component } from "react";
import { auth } from "../services/firebase";
import { db } from "../services/firebase";
import { Fragment } from 'react'
import { Popover, Transition } from '@headlessui/react'
import Settings from "../components/Settings";
import { Dialog, Menu } from '@headlessui/react'
import {
  BellIcon,
  ClockIcon,
  CogIcon,
  CreditCardIcon,
  DocumentReportIcon,
  HomeIcon,
  MenuAlt1Icon,
  QuestionMarkCircleIcon,
  ScaleIcon,
  ShieldCheckIcon,
  UserGroupIcon,
} from '@heroicons/react/outline'
import {
  CashIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  OfficeBuildingIcon,
  SearchIcon,
} from '@heroicons/react/solid'
import {
  MenuIcon,
  XIcon,
} from '@heroicons/react/outline'
import Footer from "../components/Footer";

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
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.update = this.update.bind(this);
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
        content: this.state.content,
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
    const d = new Date(timestamp);
    const time = `${d.getDate()}/${(d.getMonth()+1)}/${d.getFullYear()} ${d.getHours()}:${d.getMinutes()}`;
    return time;
  }
  update(status) {
    this.setState({open:status})
  }
  async updateUser(name) {
    await auth().currentUser.updateProfile({
      displayName: name
    })
  }
  classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }

  render() {
    return (
        <div className="h-screen bg-white xl:overflow-y-hidden">
          <Settings {...this.state} update = {this.update} username = {this.updateUser} />
        <Popover className="relative bg-white shadow">
          {({ open }) => (
            <>
              <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="flex justify-between items-center py-2 md:justify-start md:space-x-10">
                  <div className="flex justify-start lg:w-0 lg:flex-1">
                    <a href="/">
                      <span className="sr-only">Chatty</span>
                      <h1 className="text-4xl tracking-tight font-extrabold sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl text-indigo-600 xl:inline">Chatty</h1>
                    </a>
                  </div>
                  <div className="-mr-2 -my-2 md:hidden">
                    <Popover.Button className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                      <span className="sr-only">Open menu</span>
                      <MenuIcon className="h-6 w-6" aria-hidden="true" />
                    </Popover.Button>
                  </div>
                  <div className="hidden md:flex items-center justify-end md:flex-1 lg:w-0">
                  
                    <Menu as="div" className="ml-3 relative">
                {({ open }) => (
                  <>
                    <div>
                      <Menu.Button className="max-w-xs bg-white rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 lg:p-2 lg:rounded-md lg:hover:bg-gray-50">
                        <img
                          className="rounded-full border-2 border-blue-700 h-10 w-10 object-cover"
                          src={this.state.user.photoURL}
                          alt=""
                        />
                        <span className="hidden ml-3 text-gray-700 text-sm font-medium lg:block">
                          <span className="sr-only">Open user menu for </span>{this.state.user.displayName}
                        </span>
                        <ChevronDownIcon
                          className="hidden flex-shrink-0 ml-1 h-5 w-5 text-gray-400 lg:block"
                          aria-hidden="true"
                        />
                      </Menu.Button>
                    </div>
                    <Transition
                      show={open}
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items
                        static
                        className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                      >
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={() => this.setState({open: true})}
                              className={this.classNames(
                                active ? 'bg-gray-100' : '',
                                'block px-4 py-2 text-sm text-gray-700'
                              )}
                            >
                              Settings
                            </button>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={() => auth().signOut()}
                              className={this.classNames(
                                active ? 'bg-gray-100' : '',
                                'block px-4 py-2 text-sm text-gray-700'
                              )}
                            >
                              Logout
                            </button>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </>
                )}
              </Menu>
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
                      <div className="hidden md:flex items-center justify-end md:flex-1 lg:w-0">
                    <button
                      onClick={() => auth().signOut()}
                      className="ml-8 whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                      Sign out
                    </button>
                  </div>
                  <div>
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
  
            
        <div className=" p-10 h-4/5 overflow-y-scroll bg-gray-50" ref={this.myRef}>
          {/* loading indicator */}
          {this.state.loadingChats ? <div className="spinner-border text-success" role="status">
            <span className="sr-only">Loading...</span>
          </div> : ""}
          {/* chat area */}
          {this.state.chats.map(chat => {
            return <p key={chat.timestamp} className={"text-xl tracking-tight text-white rounded-lg p-5 m-3 max-w-lg break-normal" + (this.state.user.uid === chat.uid ? " bg-blue-700 ml-auto" : " bg-gray-700")}>
              <span className=" text-xs  text-white align-middle ml-2 "><img className="float-left rounded-full h-9 w-9 object-cover bg-white" src={chat.profileSrc} ></img>{chat.userName}</span>
              <br/>
              <br/>
               {chat.content}
              <br/>
              <br/>
              <span className=" text-xs italic text-white float-right">{this.formatTime(chat.timestamp)}</span>

            </p>
          })}
        </div>
        <div className="bg-white shadow-inner">
          <div>
        <form onSubmit={this.handleSubmit} className="mx-3">
          <button type="submit" className="mr-4 mt-2 whitespace-nowrap float-right inline-flex items-center justify-center px-5 ml-2 py-5 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700">Send</button>
          <textarea className="form-control mt-2 float-right rounded-lg xl:w-1/3 lg:w-1/2 md:w-1/2 sm:w-4/6 xs:w-full w-3/5 " name="content" onChange={this.handleChange} value={this.state.content}></textarea>
          {this.state.error ? <p className="text-danger">{this.state.error}</p> : null}
          
        </form>
        </div>
        
        <div className="py-5 mx-3">
          Signed in as: <span className="text-wrap font-bold">{this.state.user.email}</span>
        </div>
        </div>
        <Footer/>
      </div>
      
    );
  }
}

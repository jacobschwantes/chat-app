import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XIcon } from '@heroicons/react/outline'
import { LinkIcon, PlusIcon, QuestionMarkCircleIcon } from '@heroicons/react/solid'
const apiKey = '92b6054cc5ae55e3c2cf90e86b63b095'

export default function Settings(props) {
    const [text, setText] = useState('');
    const [image, setImage] = useState('');
    async function handleSubmit(e) {
        e.preventDefault();
        props.username(text);
        props.update(false);
    };
    function handleChange(e) {
        setText(e.target.value);
    };
    function handleImage(e) {
        setImage(e.target.files[0]);
    }
    return (
        <Transition.Root show={props.open} as={Fragment}>
            <Dialog as="div" static className="fixed inset-0 overflow-hidden" open={props.open} onClose={props.update}>
                <div className="absolute inset-0 overflow-hidden">
                    <Dialog.Overlay className="absolute inset-0" />

                    <div className="fixed inset-y-0 pl-16 max-w-full right-0 flex">
                        <Transition.Child
                            as={Fragment}
                            enter="transform transition ease-in-out duration-500 sm:duration-700"
                            enterFrom="translate-x-full"
                            enterTo="translate-x-0"
                            leave="transform transition ease-in-out duration-500 sm:duration-700"
                            leaveFrom="translate-x-0"
                            leaveTo="translate-x-full"
                        >
                            <div className="w-screen max-w-md">
                                <form className="h-full divide-y divide-gray-200 flex flex-col bg-white shadow-xl" onSubmit={handleSubmit} id="settings-form">
                                    <div className="flex-1 h-0 overflow-y-auto">
                                        <div className="py-6 px-4 bg-indigo-700 sm:px-6">
                                            <div className="flex items-center justify-between">
                                                <Dialog.Title className="text-lg font-medium text-white">Settings</Dialog.Title>
                                                <div className="ml-3 h-7 flex items-center">
                                                    <button
                                                        type="button"
                                                        className="bg-indigo-700 rounded-md text-indigo-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                                                        onClick={() => props.update(false)}
                                                    >
                                                        <span className="sr-only">Close panel</span>
                                                        <XIcon className="h-6 w-6" aria-hidden="true" />
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="mt-1">
                                                <p className="text-sm text-indigo-300">
                                                    Update your profile picture and username
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex-1 flex flex-col justify-between">
                                            <div className="px-4 divide-y divide-gray-200 sm:px-6">
                                                <div className="space-y-6 pt-6 pb-5">
                                                    <div>
                                                        <label htmlFor="project-name" className="block text-sm font-medium text-gray-900">
                                                            Username
                                                        </label>
                                                        <div className="mt-1">
                                                            <input
                                                                onChange={handleChange}
                                                                type="text"
                                                                name="project-name"
                                                                id="project-name"
                                                                required
                                                                className="block w-full shadow-sm sm:text-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="sm:col-span-6">
                                                        <label htmlFor="cover-photo" className="block text-sm font-medium text-gray-700">
                                                            Profile picture
                                                        </label>
                                                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                                                            <div className="space-y-1 text-center">
                                                                <svg
                                                                    className="mx-auto h-12 w-12 text-gray-400"
                                                                    stroke="currentColor"
                                                                    fill="none"
                                                                    viewBox="0 0 48 48"
                                                                    aria-hidden="true"
                                                                >
                                                                    <path
                                                                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                                                        strokeWidth={2}
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                    />
                                                                </svg>
                                                                <div className="flex text-sm text-gray-600">
                                                                    <label
                                                                        htmlFor="file-upload"
                                                                        className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                                                                    >
                                                                        <span>Upload a file</span>
                                                                        <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleImage}/>
                                                                    </label>
                                                                    <p className="pl-1">or drag and drop</p>
                                                                </div>
                                                                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                                                            </div>
                                                        </div>
                                                    </div>  
                                                  
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex-shrink-0 px-4 py-4 flex justify-end">
                                        <button
                                            type="button"
                                            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                            onClick={() => props.update(false)}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="ml-4 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                        >
                                            Save
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    )
}
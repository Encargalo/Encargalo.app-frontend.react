//react
import { useState } from "react";
//components
import Login from "./Login";
import SignUp from "./SignUp";
//store/hooks
import useOnLoginStore from "../../store/onLoginStore";

const SessionModal = ({ onOpenWelcome, setAddress }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [session, setSession] = useState(true)

    const { isLoginModalOpen, closeLoginModal } = useOnLoginStore()


    if (!isLoginModalOpen) return null;

    return (
        <dialog className="fixed inset-0 bg-transparent size-full backdrop-blur-sm flex items-center justify-center z-50 ">
            <div className="size-full relative  lg:flex lg:justify-center lg:items-center">

                {
                    session ?

                        /* Login */
                        <div
                            className={`transition-transform duration-100 h-full flex items-center justify-center sm:px-24 px-4 w-screen`}
                        >
                            <Login
                                onClose={closeLoginModal}
                                showPassword={showPassword}
                                setShowPassword={setShowPassword}
                                isLoading={isLoading}
                                setIsLoading={setIsLoading}
                                onOpenWelcome={onOpenWelcome}
                                session={session}
                                setSession={setSession}
                                setAddress={setAddress}

                            />
                        </div>
                        :

                        /* SignUp */
                        <div
                            className={`transition-transform duration-100 h-full w-screen flex items-center justify-center sm:px-24 px-4 lg:w-10/12`}
                        >
                            <SignUp
                                onClose={closeLoginModal}
                                showPassword={showPassword}
                                setShowPassword={setShowPassword}
                                isLoading={isLoading}
                                setIsLoading={setIsLoading}
                                onOpenWelcome={onOpenWelcome}
                                session={session}
                                setSession={setSession}
                                setAddress={setAddress}
                            />
                        </div>

                }

            </div>
        </dialog>
    );
};

export default SessionModal;

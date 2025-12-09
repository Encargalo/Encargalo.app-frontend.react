import { useEffect } from "react";
import { ilustrations } from "../../../assets/ilustrations";
import { useNavigate } from "react-router-dom";
import { routes } from "../../../const_global";

const ShopNotFound = ({ toggleShopNotFound }) => {

    //block scroll body when modal is open
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "auto";
        };
    }, []);

    const navigate = useNavigate()

    if (!toggleShopNotFound) return null

    return (
        <section className="background w-full h-full absolute top-0 left-0 flex flex-col items-center justify-center sm:px-2 px-5 pt-20 sm:py-0">
            <div>
                <img src={ilustrations.PageNotFound} alt={ilustrations.PageNotFound} className="sm:w-[450px] w-[250px] object-cover" />
            </div>

            <div className="flex flex-col gap-2 items-center">
                <div className="space-y-2 text-center">
                    <h1 className="text-white sm:text-4xl text-2xl">La tienda no está disponible</h1>
                    <h2 className="text-white sm:text-lg text-opacity-80">Parece que la tienda que buscas no existe o se encuentra fuera de tu zona</h2>
                    <p className="text-white sm:text-lg text-opacity-80">Por favor, verifica el enlace o intenta con otra ubicación.</p>
                </div>
                <button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-2 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl sm:text-xl text-lg mt-4"

                    onClick={() => navigate(routes.home)}
                >Volver al menú</button>
            </div>

            <a href="https://storyset.com/web" className="absolute -bottom-3/4 sm:-bottom-24 left-0 p-2">Web illustrations by Storyset</a>
        </section>
    )
}

export default ShopNotFound
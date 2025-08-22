import { Calendar } from "lucide-react";

const InputCalendar = ({
    label,
    id,
    name,
    register,
    errors,
    rules = {},
    className = "",
}) => {

    const today = new Date().toISOString().split("T")[0];
    return (
        <div className={className}>
            <label
                htmlFor={id}
                className="block text-base sm:text-xl font-semibold text-gray-700 mb-2"
            >
                {label}
            </label>
            <div className="relative">
                <Calendar className="absolute left-3 top-4 sm:top-5 text-orange-500 size-5" />
                <input
                    id={id}
                    name={name}
                    type="date"
                    className="w-full pl-10 pr-3 py-3 sm:py-4 border-2 text-lg sm:text-xl border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500"
                    {...register(name, rules)}
                    max={today}
                />
            </div>
            {errors[name] && (
                <p className="text-base my-2 pl-4 text-red-600">
                    {errors[name].message}
                </p>
            )}
        </div>
    );
};

export default InputCalendar;

import useForm from "./useForm";

const Form = () => {
    const {
        errors,
        formRef,
        handleOnSubmit,
        handleOnReset
    } = useForm();

    return (
        <form className="flex flex-col space-y-3 p-4"
            ref={formRef}
            onSubmit={handleOnSubmit}
        >
            <div className="flex flex-col">
                <label className="block">
                    XML
                </label>
                <input type="file" name="xml" id="xml"></input>
            </div>
            <div className="flex flex-col">
                <label htmlFor="sizeLine">SizeLine</label>
                <select name="sizeLine">
                    <option value="0.5">0.5</option>
                    <option value="0.2">0.2</option>
                </select>
            </div>
            <div className="flex flex-col">
                <label htmlFor="sizeLineCell">SizeLineCell</label>
                <select name="sizeLineCell">
                    <option value="0.5">0.5</option>
                    <option value="0.2">0.2</option>
                </select>
            </div>
            <div className="flex space-x-2 flex-wrap">
                <div className="flex flex-col">
                    <label className="">
                        ColorLine:
                    </label>
                    <input type="color" name="colorLine" id="colorLine" />
                </div>
                <div className="flex flex-col">
                    <label className="block">
                        BackgroudCell:
                    </label>
                    <input type="color" name="backgroudCell" id="backgroudCell" />
                </div>
                <div className="flex flex-col">
                    <label className="block">
                        ColorTextCell:
                    </label>
                    <input type="color" name="colorTextCell" id="colorTextCell" />
                </div>
            </div>
            {errors && (
                <p className="text-red-700">{errors}</p>
            )}
            <div className="flex space-x-2">
                <button
                    type="submit"
                    className="bg-blue-500 p-2 rounded-md hover:bg-blue-400 text-white"
                >
                    Generar PDF
                </button>
                <button
                    type="reset"
                    onClick={handleOnReset}
                    className=" p-2 rounded-md hover:bg-blue-400 text-black"
                >
                    Limpiar
                </button>
            </div>
        </form>
    )
}

export default Form;

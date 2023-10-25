import { useCallback, useEffect, useRef, useState } from "react";

const XML_TYPE = 'text/xml';
const API_URL = 'https://test.softwarepaq1.com/apiPDF/apiPDF.php';

const useForm = () => {
    const formRef = useRef(null);
    const [encodedXml, setEncodedXml] = useState('');
    const [jsonParam, setJsonParam] = useState(null);
    const [pdf64, setPdf64] = useState(null);
    const [errors, setErrors] = useState(null);
    const [isDisplayPdf, setIsDisplayPdf] = useState(false);

    const handleOnValidateXML = useCallback((xml) => {
        const type = xml.type;
        if (type === XML_TYPE) {
            return true;
        }
        return false;
    }, []);

    const handleOnConvertXML = useCallback((xml) => {
        const reader = new FileReader();
        reader.addEventListener("load", async () => {
            const result = reader.result;
            const encodedXml = btoa(result);
            setEncodedXml(encodedXml);
        });
        reader.readAsText(xml);
    }, []);

    const handleConvertHexToRgb = useCallback((hexColor) => {
        hexColor.replace("#", "");
        const red = parseInt(hexColor.substring(0, 2), 16);
        const green = parseInt(hexColor.substring(2, 4), 16);
        const blue = parseInt(hexColor.substring(4, 6), 16);
        return `${red},${green},${blue}`;
    }, []);

    const validateForm = useCallback((xml) => {
        if (!xml) {
            return true;
        }
        return false;
    }, []);

    const handleOnCreateJSON = useCallback((formData) => {
        const xml = formData.get('xml');
        const isNotNull = validateForm(xml);
        const isXMLFile = handleOnValidateXML(xml);
        if (isXMLFile && !isNotNull) {
            handleOnConvertXML(xml);
            const colorLine = handleConvertHexToRgb(formData.get('colorLine'));
            const backgroundCell = handleConvertHexToRgb(formData.get('backgroudCell'));
            const colorTextCell = handleConvertHexToRgb(formData.get('colorTextCell'));
            const sizeLine = formData.get('sizeLine');
            const sizeLineCell = formData.get('sizeLineCell');

            return {
                xml64: '',
                logo64: '',
                colorLine,
                sizeLine,
                backgroundCell,
                sizeLineCell,
                colorTextCell
            }
        }
        return null;
    }, [handleConvertHexToRgb, handleOnConvertXML, handleOnValidateXML, validateForm]);

    const handleOnCreatePdf = useCallback(async (jsonParam) => {
        const options = {
            method: 'POST',
            body: JSON.stringify(jsonParam),
        };
        try {
            const reponse = await fetch(API_URL, options);
            const data = await reponse.json();
            if (data.pdf64) {
                setPdf64(data.pdf64.split('|')[1]);
                return;
            }
            setErrors(data.DescripError);
        } catch (error) {
            setErrors(error);
        }
    }, []);

    const handleOnSubmit = useCallback((e) => {
        e.preventDefault();
        const formData = new FormData(formRef.current);
        const json = handleOnCreateJSON(formData);
        if (json) {
            setErrors(null);
            setJsonParam(json);
            return;
        }
        setErrors('No es un XML valido ó inserte un XML');
    }, [handleOnCreateJSON]);

    const handleOnReset = useCallback(() => {
        formRef.current.reset();
        const root = document.getElementById('root');
        const iframe = root?.querySelector('iframe');
        if (iframe) {
            root?.removeChild(iframe);
        }
    }, []);

    useEffect(() => {
        if (encodedXml && jsonParam) {
            jsonParam.xml64 = encodedXml;
            handleOnCreatePdf(jsonParam);
        }
    }, [encodedXml, handleOnCreatePdf, jsonParam]);

    useEffect(() => {
        if (pdf64) {
            setIsDisplayPdf(true);
        }
    }, [pdf64]);

    useEffect(() => {
        if (isDisplayPdf) {
            const linkSource = `data:application/pdf;base64,${pdf64}`;
            const iframe = document.createElement("iframe");
            iframe.src = linkSource;
            iframe.width = 470;
            iframe.height = 600;
            const root = document.getElementById('root');
            root.appendChild(iframe);
        }
    }, [isDisplayPdf, pdf64]);

    return {
        formRef,
        handleOnSubmit,
        errors,
        handleOnReset
    }
}

export default useForm;

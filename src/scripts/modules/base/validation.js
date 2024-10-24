import { z } from "../../libraries/zod.js"
import { sendData } from "../utils.js";


function getTextInsideSquareBrackets(text) {
    const startIndex = text.indexOf('['); // Находим индекс первой открывающей скобки
    const endIndex = text.lastIndexOf(']'); // Находим индекс последней закрывающей скобки
    if (startIndex !== -1 && endIndex !== -1 && startIndex < endIndex) { // Проверяем, что скобки найдены и первая скобка находится перед последней
        return text.substring(startIndex + 1, endIndex); // Возвращаем текст между первой и последней скобками
    } else {
        return ''; // Если скобки не найдены или первая скобка находится после последней, возвращаем пустую строку
    }
}

const schemaRegister = z.object({
    email: z.string()
        .email({ message: "Invalid email address" }),
    password: z.string()
        .min(4,{message: "слишком коротко"}),
    repeat_password: z.string()
        .min(4,{message: "слишком коротко"}),
}).refine(
    (data) => data.password === data.repeat_password, {
    message: "Passwords don't match",
    path: ["password","repeat_password"], // path of error
});
const schemaNewPass = z.object({
    password: z.string()
        .min(4,{message: "слишком коротко"}),
    repeat_password: z.string()
        .min(4,{message: "слишком коротко"}),
}).refine(
    (data) => data.password === data.repeat_password, {
    message: "Passwords don't match",
    path: ["password","repeat_password"], // path of error
});
const schemaLogin = z.object({
    email: z.string()
        .email({ message: "Invalid email address" }),
    password: z.string()
        .min(4,{message: "слишком коротко"}),
});
const schemaCallBack = z.object({
    email: z.string(),
    phone: z.string()
        .min(18),
    first_name: z.string()
        .min(1),
    last_name: z.string()
        .min(1),
});
const schemaReview = z.object({
    first_name: z.string()
        .min(1),
    last_name: z.string()
        .min(1),
    review: z.string()
        .min(1),
});

export function validation() {
    const loginForm = document.querySelector('#login-menu-form');
    if(loginForm) {
        formValidate(
            loginForm, 
            schemaLogin, 
            (body) =>{
                console.log(body);
            }
        )
    }
}

function formValidate(form, schema, callBack, formData) {
    form.onsubmit = (e) => {
        e.preventDefault();
    }
    const button = form.elements.button;

    const inputs = Object.keys(getBody(form))
        .map(el=> 
            form.elements[`${el}`]
        )

    inputs.forEach((el)=>{
        el.oninput = (evt) => {
            el.classList.remove('error');

            const body = getBody(evt.target.form);
            validateParse({
                schema: schema,
                body,
            }).then(res => {
                if(button) button.disabled = false;
                if(button && form.dataset.state && form.dataset.state == 'disabled') button.disabled = true;
                inputs.forEach((el) => {
                    el.classList.remove('error');
                });
                if(button) button.onclick = () => {
                    const formDataBody = new FormData(form);
                    if(callBack) formData ? callBack(formDataBody) : callBack(body);
                }
            }).catch(error => {
                const parse = JSON.parse(`[${getTextInsideSquareBrackets(error.toString())}]`);
                const nameErrorInput = parse.map(el=>el.path[0]);
                let input = [];
                for(const errorName of nameErrorInput) {
                    input.push(form.elements[`${errorName}`]);
                }
                if(button) button.disabled = true;
                input.forEach((el) => {
                    el.classList.add('error');
                });
                if(button) button.onclick = () => {};
            });
        }
    })
}

async function validateParse(validateInfo) {
    try {
        validateInfo.schema.parse(validateInfo.body);
        console.log("Validation successful");
        if(typeof validateInfo?.callback == 'function')validateInfo?.callback();
        return true;
    } 
    catch (error) {
        if (error instanceof z.ZodError) {
            // console.error("Validation failed:", error.errors);
            throw new Error(JSON.stringify(error.errors));
        } else {
            // console.error("Unknown error", error);
        }
    }
}

function getBody(form) {
    const formData = new FormData(form);
    const body = {};
    for (let [name, value] of formData.entries()) {
        body[name] = value;
    }
    return body;
}

function getQuery(query) {
    const searchParams = new URLSearchParams(window.location.search);
    return searchParams.get(query);
}

// Для корректной работы необходимо подключить и активировать эту функцию в app.js

// Пример подключения: import { validation } from "./путь/к/файлу/validation.js";

// Активация: validation();
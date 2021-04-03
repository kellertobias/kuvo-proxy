const download = (content: string | Buffer, mime: string = 'text/plain;charset=utf-8', filename: string = 'file.txt') => {
    const element = document.createElement('a');
    if(content === undefined) {
        console.log("TEXT is UNDEFINED")
    }
    const text = typeof content === 'string' ? content : content.toString()
    element.setAttribute('href', `data:${mime},` + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

export default download
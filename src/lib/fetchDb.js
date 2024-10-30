console.log('loaded');
const upTreeTo = (tagName, ofElement) => {
    let found = undefined;
    let parent = ofElement;
    do {
        parent = parent.parentElement
        if(parent.tagName === tagName)
            found = parent;
    } while(parent && !found);
    return found;
}
const toggleStyle = (el, styleName, value) => {
    if(el.style[styleName] === value)
        el.style[styleName] = 'initial'
    else
        el.style[styleName] = value;
}
const handleTableClick = (evt) => {
    const target = evt.target;
    console.log(target);
    if(target.tagName === 'TH') {
        toggleStyle(target, 'textDecoration', 'underline');
        let table = upTreeTo('TABLE', target);
        let columnName = target.dataset.column;
        let cells = table.querySelectorAll(`td[data-column='${columnName}'`);
        cells.forEach(el => {
            toggleStyle(el, 'borderWidth', '3px');
            toggleStyle(el, 'borderColor', 'green');
            toggleStyle(el, 'borderStyle', 'solid');
        })
        console.log("table", table);        
    }

    if(target.tagName === 'TD') {
        toggleStyle(target, 'backgroundColor', 'rgb(218, 212, 194)'); // DARK:, 'rgb(73, 70, 63)');
    }
}
const handleJsonData = function(tableData) {
    const element = buildTableContainer(tableData);
    element.querySelector('table').addEventListener('click', handleTableClick);
    console.log(element);
    document.body.appendChild(element);
}
const buildTableContainer = function(data) {
    const columns = Object.keys(data.data[0]);
    const fq = (m) => `${data.tableName}.${m}`;
    const columnHeadings = columns.map(item => `<th data-column='${fq(item)}'>${item}</th>`).join('');
    let html = `<caption>${data.tableName}</caption><thead><tr>${columnHeadings}</tr></thead>`;
    const rows = data.data.map(row => `<tr>${columns.map(col => `<td data-column='${fq(col)}'>${row[col]}</td>`).join('')}</tr>`).join('');
    html += `<tbody>${rows}</tbody>`
    const table = document.createElement('table');
    table.innerHTML = html;
    table.style.width = 'fit-content';

    const details = document.createElement('details');
    details.innerHTML = `<summary>${data.tableName}</summary>`;
    details.appendChild(table);
    // console.log(columnHeadings)
    return details;
}
const handleJsonFetch = async (response) => {
    // console.log(response)
    const parts = response.url.split('/');
    return {
        tableName: parts[parts.length - 1].replace('.json', ''),
        data: await response.json()
    };
};

const loadTables = function(sourceData) {
    // console.log(sourceData)
    if(sourceData.files) {
        sourceData.files.forEach((el) => {
            // console.log(el);
            const url = `${sourceData.basePath}${el}`;
            // console.log(url);
            fetch(url)
                .then(handleJsonFetch )
                .then(handleJsonData)
        });
    }
    console.log('school.astro file')
    document.body.innerHTML += '<h4>Hello</h4>'

}


const data = {
    basePath: '/SchoolDb/', 
    files: [
        'Activity.json',
        'Club.json',
        'Course.json',
        'Payment.json',
        'PaymentType.json',
        'Position.json',
        'Registration.json',
        'Staff.json',
        'Student.json',
    ]
}
loadTables(data);
//export { loadTables }



import markdownit from 'markdown-it';

console.log('loaded renderMd.js');
const rr = document.getElementById('renderResult');
console.log(rr);
rr.addEventListener('click', (evt) => {
    evt.preventDefault();
    const markdown = document.getElementById('result').innerText;
    const md = markdownit();
    const output = md.render(markdown);
    document.getElementById('output').innerHTML = output;
});
document.getElementById('clearResult').addEventListener('click', (evt) => {
    evt.preventDefault();
    document.getElementById('output').innerHTML = '';
});
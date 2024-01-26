import './style.css'
import dayjs from 'dayjs'

function getArrayOfDays(month: number, year: number) {
  const daysInMonth = dayjs(`${year}-${month}`).daysInMonth()
  const days = []
  for (let i = 1; i <= daysInMonth; i++) {
    const day = dayjs(`${year}-${month}-${i}`)
    days.push({
      DD: day.format('DD'),
      ddd: day.format('ddd'),
      friday: day.day() === 5,
      saturday: day.day() === 6,
      sunday: day.day() === 0
    })
  }
  return days
}

function addPerson(value = '') {
  var div = document.createElement('div');
  div.innerHTML = `
  <div class="flex items-center gap-1 mt-2">
    <input class="people-input block w-full px-2.5 py-1.5 rounded" placeholder="Max" value="${value}" />
    <button id="remove-asd" class="self-center p-2" onClick="this.parentNode.remove()">
      <svg class="w-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>
    </button>
  </div>
  `.trim();

  const peopleWrapper = document.getElementById('peopleWrapper');
  if (!peopleWrapper) throw new Error('People-Wrapper not found');
  peopleWrapper.appendChild(div.firstChild!);
}

function addExtraCol(value = '') {
  var div = document.createElement('div');
  div.innerHTML = `
  <div class="flex items-center gap-1 mt-2">
    <input class="extraCol-input block w-full px-2.5 py-1.5 rounded" placeholder="Geburtstag" value="${value}" />
    <button id="remove-asd" class="self-center p-2" onClick="this.parentNode.remove()">
      <svg class="w-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>
    </button>
  </div>
  `.trim();

  const extraColsWrapper = document.getElementById('extraColsWrapper');
  if (!extraColsWrapper) throw new Error('ExtraCols-Wrapper not found');
  extraColsWrapper.appendChild(div.firstChild!);
}

window.onload = () => {
  addPerson('Paul')
  addPerson('Gesche')
  addPerson('Momme')
  addPerson('Amelie')

  addExtraCol('Kochen')
  addExtraCol('Abwasch')
  addExtraCol('Bad')

  const addPeopleButtonElement = document.getElementById('addPeopleButton');
  if (!addPeopleButtonElement) throw new Error('Button not found');
  addPeopleButtonElement.addEventListener('click', () => addPerson())

  const addExtraColsButtonElement = document.getElementById('addExtraColsButton');
  if (!addExtraColsButtonElement) throw new Error('Button not found');
  addExtraColsButtonElement.addEventListener('click', () => {

  })

  const downloadButtonElement = document.getElementById('downloadButton');
  if (!downloadButtonElement) throw new Error('Button not found');
  downloadButtonElement.addEventListener('click', () => {
    console.log('clicked');

    const year = parseInt((document.getElementById('year') as HTMLInputElement).value)
    const month = parseInt((document.getElementById('month') as HTMLInputElement).value)
    const people = (Array.from(document.getElementsByClassName('people-input')) as HTMLInputElement[]).map((input: HTMLInputElement) => input.value)
    const extraCols = (Array.from(document.getElementsByClassName('extraCol-input')) as HTMLInputElement[]).map((input: HTMLInputElement) => input.value)
  
    document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
    <div class="text-fuchsia-900 h-full">
      <script src="https://cdn.tailwindcss.com"></script>
      <div class="flex justify-between text-xl font-semibold">
        <div>${dayjs(`${year}-${month}`).format('MMMM')} ${year}</div>
        <div>WG-Kalender :)</div>
      </div>
      <table class="table-fixed w-full h-[95%]">
        <thead class="border-y border-fuchsia-800 text-sm">
          <tr>
            <th class="">Datum</th>
            ${people.map((person, i) => `<th class="border-r border-fuchsia-800 ${i===0 ? 'border-l-2' : ''}">${person}</th>`).join('\n')}
            ${extraCols.map((extraCols, i) => `<th class="border-l border-r border-fuchsia-800 ${i===0 ? 'border-l-2' : ''}">${extraCols}</th>`).join('\n')}
          </tr>
        </thead>
        <tbody>
          ${getArrayOfDays(month, year).map(day => `
            <tr class="border-b border-gray-100 ${day.friday ? 'border-b-0' : ''} ${day.saturday ? 'bg-fuchsia-200 border-b-0' : ''} ${day.sunday ? 'bg-fuchsia-300 border-b-0' : ''}">
              <td class="border-r-2 border-fuchsia-800"><span class="font-semibold mr-2 ml-1">${day.DD}</span><span class="text-xs">${day.ddd}</span></td>
              ${people.map(() => `<td class="border-r border-fuchsia-800"></td>`).join('\n')}
              ${people.map((_, i) => `<td class="border-l border-fuchsia-800 ${i === 0 ? 'border-l-2' : ''}"></td>`).join('\n')}
            </tr>
          `).join('\n')}
        </tbody>
      </table>
    </div>
    `
  })


}
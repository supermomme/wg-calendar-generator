import { Title } from "@solidjs/meta";
import { For, createSignal } from "solid-js";
import { createStore } from "solid-js/store";
// import Counter from "~/components/Counter";

export default function Home() {

  const [people, setPeople] = createStore([
    { id: 1, text: 'Paul'},
    { id: 2, text: 'Gesche'},
    { id: 3, text: 'Momme'},
    { id: 4, text: 'Amelie'}
  ]);

  const [extraCols, setExtraCols] = createStore([
    { id: 1, text: 'Kochen'},
    { id: 2, text: 'Abwasch'},
    { id: 3, text: 'Bad'},
  ]);

  const [year, setYear] = createSignal<number>(2024);
  const [month, setMonth] = createSignal<number>(1);


  async function downloadPDF() {
    try {
      // Make a POST request to your server to generate the PDF
      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          people: people.map(p => p.text),
          extraCols: extraCols.map(p => p.text),
          year: year(),
          month: month()
        }),
      });


      // Check if the request was successful (status code 200)
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Convert the response to a Blob
      const blob = await response.blob();

      // Create a link element to trigger the download
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = `WG-Kalendar-${year()}-${month()}.pdf`;
      document.body.appendChild(link);

      // Trigger the download
      link.click();

      // Remove the link element from the DOM
      document.body.removeChild(link);

    } catch (error) {
      console.error('Error downloading PDF:', error);
      // Handle error as needed
    }
  }


  return (
    <main>
      <Title>Hello World</Title>
      {/* <h1>Hello world!</h1>
      <button onClick={downloadPDF}>Download PDF</button> */}
      <div class="flex justify-center w-full h-full items-center">
        <div class="bg-violet-100 bg w-[40rem] mt-32 px-8 py-8 rounded space-y-4">
          <h1 class="text-4xl font-bold text-gray-800 mb-3">WG-Kalender</h1>

          <div>
            <div class="grid grid-cols-2 gap-3 w-full ">
              <div>
                <label for="year" class="block font-medium text-gray-900">Jahr</label>
                <select id="year" class="block w-full rounded text-gray-900 px-2.5 py-1.5" value={year()} onInput={e => setYear(parseInt(e.currentTarget.value))}>
                  <option value={2024}>2024</option>
                  <option value={2025}>2025</option>
                  <option value={2026}>2026</option>
                  <option value={2026}>2027</option>
                </select>
              </div>
              <div>
                <label for="month" class="block font-medium text-gray-900">Monat</label>
                <select id="month" class="block w-full rounded text-gray-900 px-2.5 py-1.5" value={month()} onInput={e => setMonth(parseInt(e.currentTarget.value))}>
                  <option value={1}>Januar</option>
                  <option value={2}>Februar</option>
                  <option value={3}>März</option>
                  <option value={4}>April</option>
                  <option value={5}>Mai</option>
                  <option value={6}>Juni</option>
                  <option value={7}>Juli</option>
                  <option value={8}>August</option>
                  <option value={9}>September</option>
                  <option value={10}>Oktober</option>
                  <option value={11}>November</option>
                  <option value={12}>Dezember</option>
                </select>
              </div>
            </div>
          </div>

          <div class="flex flex-col">
            <h3 class="block font-medium text-gray-900">Menschen</h3>
            {people.map((item, i) => (
              <div class="flex items-center gap-1 mt-2">
                <input id={`input-${item.id}`} class="block w-full px-2.5 py-1.5 rounded" placeholder="Max" value={item.text} onInput={(e) => setPeople(o => o.id === item.id, "text", e.target.value)} />
                <button class="self-center p-2" onClick={() => setPeople(people.filter((_, index) => i !== index))}>
                  <svg class="w-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>
                </button>
              </div>
            ))}
            
            <button class="self-center mt-3" onClick={() => setPeople([ ...people, { id: people[people.length-1].id + 1, text: '' }])}>
              <svg class="w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M64 80c-8.8 0-16 7.2-16 16V416c0 8.8 7.2 16 16 16H384c8.8 0 16-7.2 16-16V96c0-8.8-7.2-16-16-16H64zM0 96C0 60.7 28.7 32 64 32H384c35.3 0 64 28.7 64 64V416c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V96zM200 344V280H136c-13.3 0-24-10.7-24-24s10.7-24 24-24h64V168c0-13.3 10.7-24 24-24s24 10.7 24 24v64h64c13.3 0 24 10.7 24 24s-10.7 24-24 24H248v64c0 13.3-10.7 24-24 24s-24-10.7-24-24z"/></svg>
            </button>
          </div>

          <div class="flex flex-col">
            <h3 class="block font-medium text-gray-900">Weitere Spalten</h3>
            {extraCols.map((item, i) => (
              <div class="flex items-center gap-1 mt-2">
                <input id={`input-${item.id}`} class="block w-full px-2.5 py-1.5 rounded" placeholder="Geburtstag" value={item.text} onInput={(e) => setExtraCols(o => o.id === item.id, "text", e.target.value)} />

                <button class="self-center p-2" onClick={() => setExtraCols(extraCols.filter((_, index) => i !== index))}>
                  <svg class="w-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>
                </button>
              </div>
            ))}
            <button class="self-center mt-3" onClick={() => setExtraCols([ ...extraCols, { id: extraCols[extraCols.length-1].id + 1, text: '' }])}>
              <svg class="w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M64 80c-8.8 0-16 7.2-16 16V416c0 8.8 7.2 16 16 16H384c8.8 0 16-7.2 16-16V96c0-8.8-7.2-16-16-16H64zM0 96C0 60.7 28.7 32 64 32H384c35.3 0 64 28.7 64 64V416c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V96zM200 344V280H136c-13.3 0-24-10.7-24-24s10.7-24 24-24h64V168c0-13.3 10.7-24 24-24s24 10.7 24 24v64h64c13.3 0 24 10.7 24 24s-10.7 24-24 24H248v64c0 13.3-10.7 24-24 24s-24-10.7-24-24z"/></svg>
            </button>
          </div>


          <button class="self-center mt-3 bg-green-600 px-2.5 py-1.5 rounded text-white hover:bg-green-700 transition duration-100" onClick={() => downloadPDF()}>
            Download
          </button>
        </div>
      </div>
    </main>
  );
}

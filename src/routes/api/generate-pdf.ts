import { APIEvent } from "@solidjs/start/server/types";
import puppeteer from 'puppeteer'
import ejs from 'ejs'
import dayjs from 'dayjs'
import 'dayjs/locale/de.js'

dayjs.locale('de')

const contentHtml = `
<html>
  <head>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
      html {
        -webkit-print-color-adjust: exact;
      }
    </style>
  </head>
  <body class="text-fuchsia-900 h-full">
    <div class="flex justify-between text-xl font-semibold">
      <div><%=month%> <%=year%></div>
      <div>WG-Kalender :)</div>
    </div>
    <table class="table-fixed w-full h-[95%]">
      <thead class="border-y border-fuchsia-800 text-sm">
        <tr>
          <th class="">Datum</th>
          <% for(var i = 0; i < people.length; ++i) {%>
            <th class="border-r border-fuchsia-800 <% if(i===0){ %>border-l-2<% } %>"><%=people[i]%></th>
          <% } %>
          <% for(var i = 0; i < extraCols.length; ++i) {%>
            <th class="border-l border-fuchsia-800 <% if(i===0){ %>border-l-2<% } %>"><%=extraCols[i]%></th>
          <% } %>
        </tr>
      </thead>
      <tbody>
        <% for(var d = 0; d < days.length; ++d) {%>
          <tr class="border-b border-gray-100 <% if(days[d].friday){ %>border-b-0<% } %> <% if(days[d].saturday){ %>bg-fuchsia-200 border-b-0<% } %> <% if(days[d].sunday){ %>bg-fuchsia-300 border-b-0<% } %>">
            <td class="border-r-2 border-fuchsia-800"><span class="font-semibold mr-2 ml-1"><%=days[d].DD%></span><span class="text-xs"><%=days[d].ddd%></span></td>
            <% for(var i = 0; i < people.length; ++i) {%>
              <td class="border-r border-fuchsia-800"></td>
            <% } %>
            <% for(var i = 0; i < extraCols.length; ++i) {%>
              <td class="border-l border-fuchsia-800 <% if(i===0){ %> border-l-2 <% } %>"></td>
            <% } %>
          </tr>
        <% } %>
      </tbody>
    </table>

  </body>
</html>
`

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

// generateCalendar(2023, 9)
// generateCalendar(2023, 10)
// generateCalendar(2023, 11)
// generateCalendar(2023, 12)
async function generateCalendar(year = 2023, month = 10, people = ['Paul', 'Gesche', 'Momme', 'Amelie'], extraCols = ['Kochen', 'Abwasch', 'Besonderes']) {
  const browser = await puppeteer.launch({
    headless: 'new'
  });
  const page = await browser.newPage();
  const parsedHtml = ejs.render(contentHtml, {
    year,
    month: dayjs(`${year}-${month}`).format('MMMM'),
    people,
    extraCols,
    days: getArrayOfDays(month, year)
  });
  await page.setContent(parsedHtml);
  const buffer = await page.pdf({
    // path: `${dayjs(`${year}-${month}`).format('YYYY-MM')}.pdf`,
    format: 'A4',
    margin: {
      top: "30px",
      left: "30px",
      right: "30px",
      bottom: "30px"
    }    
  });
  await browser.close()
  return buffer
}





export async function POST(event: APIEvent) {
  const body = await new Response(event.request.body).json() as {people: string[], extraCols: string[], year: number, month: number};

  if (!body) throw new Error("No body found");
  if (!body.people) throw new Error("No people found");
  if (!body.extraCols) throw new Error("No extraCols found");
  if (!body.year) throw new Error("No year found");
  if (!body.month) throw new Error("No month found");

  const pdfBuffer = generateCalendar(body.year, body.month, body.people, body.extraCols)
  return pdfBuffer
}
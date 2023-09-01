import puppeteer from 'puppeteer'
import fs from 'fs/promises'
import ejs from 'ejs'
import dayjs from 'dayjs'
import 'dayjs/locale/de.js'

dayjs.locale('de')

function getArrayOfDays(month, year) {
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

generateCalendar(2023, 9)
generateCalendar(2023, 10)
generateCalendar(2023, 11)
generateCalendar(2023, 12)
async function generateCalendar(year = 2023, month = 10, people = ['Paul', 'Gesche', 'Momme', 'Amelie'], extraCols = ['Kochen', 'Abwasch', 'Besonderes']) {
  const browser = await puppeteer.launch({
    headless: 'new'
  });
  const page = await browser.newPage();
  const contentHtml = await fs.readFile('./calendar.ejs', 'utf8');
  const parsedHtml = ejs.render(contentHtml, {
    year,
    month: dayjs(`${year}-${month}`).format('MMMM'),
    people,
    extraCols,
    days: getArrayOfDays(month, year)
  });
  await page.setContent(parsedHtml);
  await page.pdf({
    path: `${dayjs(`${year}-${month}`).format('YYYY-MM')}.pdf`,
    format: 'A4',
    margin: {
      top: "30px",
      left: "30px",
      right: "30px",
      bottom: "30px"
    }    
  });
  await browser.close()
}



import DataTable from "@/elements/dataTable";

const dtConfig = {
  headerKeys: [
    { propName: "age", text: "Возраст" },
    { propName: "sum", text: "Кол." },
    { propName: "sumGirls", text: "Кол. девочек" },
    { propName: "class1", text: "1 кл." },
    { propName: "class2", text: "2 кл." },
    { propName: "class3", text: "3 кл." },
    { propName: "class4", text: "4 кл." },
    { propName: "class5", text: "5 кл." },
    { propName: "class6", text: "6 кл." },
    { propName: "class7", text: "7 кл." },
    { propName: "class8", text: "8 кл." },
    { propName: "class9", text: "9 кл." },
    { propName: "class10", text: "10 кл." },
    { propName: "class11", text: "11 кл." }
  ]
};

function getDateStart() {
  const now = new Date(Date.now());
  let year = now.getFullYear();
  if (now.getMonth() < 8) {
    --year;
  }
  return new Date(year, 8, 1);
}

function getRows(items) {
  const rows = [];
  const now = getDateStart();
  const nowYear = now.getFullYear();

  const preparedItems = items.map(v => ({
    ...v,
    age: nowYear - v.dob.getFullYear(),
    class: Number.parseInt(v.className.replace(/[А-я ]/g, ""), 10),
    isGirl: v.isGirl || v.name.endsWith("вна")
  }));

  for (let i = 6; i <= 18; ++i) {
    const row = {
      age: i,
      sum: 0,
      sumGirls: 0
    };

    let filter;
    if (i === 6) {
      filter = v => v.age <= i;
    } else if (i === 18) {
      filter = v => v.age >= i;
    } else {
      filter = v => v.age === i;
    }

    const ageFiltered = preparedItems.filter(filter);
    row.sum = ageFiltered.length;
    ageFiltered.forEach(v => {
      v.isGirl && ++row.sumGirls;
    });

    for (let num = 1; num <= 11; ++num) {
      let sum = 0;
      ageFiltered.forEach(v => {
        v.class === num && ++sum;
      });
      row[`class${num}`] = sum;
      row.sum += sum;
    }
    rows.push(row);
  }
  return rows;
}

export default function ClassSummary({ items }) {
  return <DataTable items={getRows(items)} config={dtConfig} />;
}

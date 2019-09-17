import DataTable from "@/elements/dataTable";

const dtConfig = {
  headerKeys: []
};

export default function ClassSummary({ items }) {
  return <DataTable items={items} config={dtConfig} />;
}

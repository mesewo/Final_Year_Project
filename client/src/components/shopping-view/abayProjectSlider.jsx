import LogoCarousel from "@/components/shopping-view/LogoCarousel";


const projects = [
  {
    key: "garment",
    name: "Abay Garment – Gondar",
    logo: "/logo/abaygarment.jpg",
    image: "/logo/abaygarment.jpg",
    location: "Gondar, Amhara Region",
    fact:
      "Opened Oct 2019, covering 4.6 ha. Daily capacity 26,000 garments and ~800 employees, with phased expansion into onsite cotton cultivation and a wastewater facility",
  },
  {
    key: "cement",
    name: "Abay Cement – Dejen",
    logo: "/logo/degenabaycement.jpg",
    image: "/logo/degenabaycement.jpg",
    location: "Dejen, Misraq Gojjam, Amhara",
    fact:
      "Built with ~8.8 bn Br capital; capacity 2.25 Mt/yr; job creation ~1,500. EPC by FLSmidth with 5,000 t/day kiln, commissioning expected within 2–3 yrs",
  },
  {
    key: "steel",
    name: "Bahir Dar Steel Mill",
    logo: "/logo/bahirdarsteefactory.jpg",
    image: "/logo/bahirdarsteefactory.jpg",
    location: "Bahir Dar, Amhara Region",
    fact:
      "Built with ~800 m Br investment. First phase cold‑rolling outputs 210,000 t rebar & wire rod/year. Plans include electric‑arc furnace expansion",
  },
  {
    key: "wood",
    name: "Wood Factories – Debre Tabor / Woldia / Debre Berhan",
    logo: "/logo/wodiawoodfactory.jpg",
    image: "/logo/wodiawoodfactory.jpg",
    location: "Debre Tabor, Woldia, Debre Berhan (Amhara)",
    fact:
      "Three plants (324 km from Addis), $111 m investment; capacity ~5,000 jobs; operations include plywood, chipboard; sets local import‑replacement & export goals",
  },
];

export default function AbayProjects() {
  return (
    <>
      <LogoCarousel items={projects} />
      {/* <ProjectDetails projects={projects} /> */}
    </>
  );
}

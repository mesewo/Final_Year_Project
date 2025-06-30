// ProjectDetails.jsx
export default function ProjectDetails({ projects }) {
  return (
    <section className="max-w-5xl mx-auto py-16 px-4 space-y-16">
      {projects.map((p) => (
        <div key={p.key} className="md:flex md:items-center gap-8">
          <img
            src={p.image}
            alt={p.name}
            className="rounded-xl shadow-lg md:w-1/2"
          />
          <div className="mt-4 md:mt-0 md:w-1/2">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {p.name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
              <strong>Location:</strong> {p.location}
            </p>
            <p className="text-base text-gray-800 dark:text-gray-200">
              {p.fact}
            </p>
          </div>
        </div>
      ))}
    </section>
  );
}

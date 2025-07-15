import UrlInput from "../components/UrlInput";

export default function HomePage() {
  return (
    <div className="min-h-dvh pt-32 sm:pt-40">
      <section>
        <h1 className="text-xl sm:text-3xl font-bold text-gray-800 mb-2 sm:mb-4 text-center">
          Let us analyze your webpage
        </h1>
        <UrlInput />
      </section>
    </div>
  )
}
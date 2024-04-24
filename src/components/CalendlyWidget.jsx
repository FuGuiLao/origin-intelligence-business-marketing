function CalendlyWidget() {
  return (
    <>
      <iframe
        src="https://outlook.office365.com/book/ORIGINClientConsultation@origininvestigations.com/"
        className="h-full w-full"
      />
      <div className="fixed left-0 top-[80px] h-[28px] w-full bg-white max-sm:h-[34px]" />
      <div className="fixed left-[20px] top-[80px] h-full w-[20px] bg-white max-sm:hidden" />
      <div className="fixed right-[40px] top-[80px] h-full w-[16px] bg-white max-sm:hidden" />
    </>
  )
}

export default CalendlyWidget

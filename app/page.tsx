import Footer from "@/components/commons/Footer";
import Image from "next/image";
import Link from "next/link";

export default function Auth() {


  return (
    <main className="page">

      <header className=" flex justify-between mx-8 mt-5  ">

        <div className="flex gap-4 *:p-8">

          <div title="PIN" className="btn-circle ">
            <div className="relative">

              <svg width="25" height="25" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9.62129 1.13607C9.81656 0.940808 10.1331 0.940809 10.3284 1.13607L11.3891 2.19673L12.8033 3.61094L13.8639 4.6716C14.0592 4.86687 14.0592 5.18345 13.8639 5.37871C13.6687 5.57397 13.3521 5.57397 13.1568 5.37871L12.5038 4.7257L8.86727 9.57443L9.97485 10.682C10.1701 10.8773 10.1701 11.1939 9.97485 11.3891C9.77959 11.5844 9.463 11.5844 9.26774 11.3891L7.85353 9.97491L6.79287 8.91425L3.5225 12.1846C3.32724 12.3799 3.01065 12.3799 2.81539 12.1846C2.62013 11.9894 2.62013 11.6728 2.81539 11.4775L6.08576 8.20714L5.0251 7.14648L3.61089 5.73226C3.41563 5.537 3.41562 5.22042 3.61089 5.02516C3.80615 4.8299 4.12273 4.8299 4.31799 5.02516L5.42557 6.13274L10.2743 2.49619L9.62129 1.84318C9.42603 1.64792 9.42603 1.33133 9.62129 1.13607Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path><path d="M9.62129 1.13607C9.81656 0.940808 10.1331 0.940809 10.3284 1.13607L11.3891 2.19673L12.8033 3.61094L13.8639 4.6716C14.0592 4.86687 14.0592 5.18345 13.8639 5.37871C13.6687 5.57397 13.3521 5.57397 13.1568 5.37871L12.5038 4.7257L8.86727 9.57443L9.97485 10.682C10.1701 10.8773 10.1701 11.1939 9.97485 11.3891C9.77959 11.5844 9.463 11.5844 9.26774 11.3891L7.85353 9.97491L6.79287 8.91425L3.5225 12.1846C3.32724 12.3799 3.01065 12.3799 2.81539 12.1846C2.62013 11.9894 2.62013 11.6728 2.81539 11.4775L6.08576 8.20714L5.0251 7.14648L3.61089 5.73226C3.41563 5.537 3.41562 5.22042 3.61089 5.02516C3.80615 4.8299 4.12273 4.8299 4.31799 5.02516L5.42557 6.13274L10.2743 2.49619L9.62129 1.84318C9.42603 1.64792 9.42603 1.33133 9.62129 1.13607Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg>

            </div>
          </div>

          <Link href={"/signin"} className="btn-circle bg-[#3eea00ac] ">
            Login
          </Link>
        </div>

        <Link href={"/signup"} className="btn-circle bg-[#3eea00ac] p-8">
          Join
        </Link>
      </header>

      <h1 className="text-center text-[96px] font-extrabold ">FIXEL</h1>


      <section className="container flex justify-center gap-15 my-80">

        <div className="flex flex-col justify-between gap-10 ">

          <div className="image-card hero-big bg-[#EA2E00] text-white">
            Image
          </div>

          <div className="card hero-text">
            Image and from image something about ppinterest
          </div>

        </div>

        <div className="flex flex-col justify-between gap-10">

          <div className="card hero-text">
            Image and from image something about pinterest
          </div>

          <div className="image-card hero-big bg-[#FE7F2D] text-white">
            Image
          </div>

        </div>

      </section>

      <section className="gallery">

        <div className="container  flex gap-20">

          <div className="image-card h-130 w-[35%]  bg-[#FE7F2D] text-white">
            Image
          </div>

          <div className=" flex flex-1 flex-col gap-10">

            <div className="image-card h-50 bg-[#FE7F2D] text-white">
              Image
            </div>

            <div className=" flex! flex-!col justify-between h-full gap-8 ">

              <div className="image-card bg-[#FE7F2D] flex-2  text-white">Image</div>
              <div className="image-card bg-[#FE7F2D] flex-1 text-white">Image</div>

            </div>

          </div>

        </div>

      </section>


      <section className="cta">

        <div className="container flex justify-center gap-50">

          <div className="cta-circle">Image</div>

          <div className="self-center">

            <div className="card mb-8 ">
              Image at left and some quote and say to join
            </div>

            <Link href={"/signup"} className="btn-rect mt-2 bg-[#3eea00ac]">JOIN</Link>

          </div>

        </div>

      </section>

      <Footer />

    </main>
  );
}

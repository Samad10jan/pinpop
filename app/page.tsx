import Footer from "@/components/commons/Footer";
import Image from "next/image";
import Link from "next/link";

export default function Auth() {


  return (
    <main className="page">

      <header className=" flex justify-between mx-8 mt-5  ">

        <div className="flex gap-4 *:p-8">

          <div title="a" className="relative btn-circle overflow-hidden ">
            <div className=" absolute w-full h-full">

              <Image
                src="https://tse1.mm.bing.net/th/id/OIP.2ZC6eH3utWfNn6yZaCEstgHaFf?w=5263&h=3903&rs=1&pid=ImgDetMain&o=7&rm=3"
                alt="avatar"
                fill
                className="w-full h-full object-cover"
              />

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

     <Footer/>

    </main>
  );
}

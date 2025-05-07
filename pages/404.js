import Image from 'next/image';

export default function Custom404() {
  return (
    <div className="container text-center py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 mt-5">
          <Image
            src="/notfoundimg.jpg"
            alt="404 Error"
            width={500}
            height={300}
            className="img-fluid"
          />
          <h3 className="mt-3">404 - Page Not Found</h3>
          <p>Oops! This page does not exist.</p>
        </div>
      </div>
    </div>
  );
}

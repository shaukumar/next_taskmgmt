import Image from 'next/image';

export default function Custom500() {
    return (
         <div className="container text-center py-5">
              <div className="row justify-content-center">
                <div className="col-12 col-md-8 mt-5">
                  <Image
                    src="/servererrimg.jpg"
                    alt="404 Error"
                    width={500}
                    height={300}
                    className="img-fluid"
                  />
                  <h3 className="mt-3">500 - Server-side Error</h3>
                  <p>Something went wrong. Please try again later.</p>
                </div>
              </div>
            </div>
     
    );
  }
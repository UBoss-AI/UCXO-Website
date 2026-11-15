"""Serve the local static review with byte ranges for seekable narration."""
import argparse
import functools
import http.server
import os
import re
from pathlib import Path

class PreviewHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Accept-Ranges','bytes')
        super().end_headers()

    def send_head(self):
        self._remaining=None
        path=self.translate_path(self.path)
        header=self.headers.get('Range')
        if not header or not os.path.isfile(path):
            return super().send_head()
        match=re.fullmatch(r'bytes=(\d*)-(\d*)',header.strip())
        size=os.path.getsize(path)
        if not match or not size:
            self.send_error(416,'Requested range not satisfiable')
            return None
        first,last=match.groups()
        if first:
            start=int(first);end=min(int(last) if last else size-1,size-1)
        elif last:
            start=max(0,size-int(last));end=size-1
        else:
            start=size;end=size-1
        if start>=size or end<start:
            self.send_response(416)
            self.send_header('Content-Range',f'bytes */{size}')
            self.send_header('Content-Length','0')
            self.end_headers()
            return None
        file=open(path,'rb')
        file.seek(start)
        self._remaining=end-start+1
        self.send_response(206)
        self.send_header('Content-Type',self.guess_type(path))
        self.send_header('Content-Length',str(self._remaining))
        self.send_header('Content-Range',f'bytes {start}-{end}/{size}')
        self.send_header('Last-Modified',self.date_time_string(os.fstat(file.fileno()).st_mtime))
        self.end_headers()
        return file

    def copyfile(self,source,outputfile):
        try:
            if self._remaining is None:
                return super().copyfile(source,outputfile)
            while self._remaining:
                data=source.read(min(65536,self._remaining))
                if not data:break
                outputfile.write(data)
                self._remaining-=len(data)
        except (BrokenPipeError,ConnectionResetError):
            pass

if __name__=='__main__':
    parser=argparse.ArgumentParser()
    parser.add_argument('--port',type=int,default=3004)
    parser.add_argument('--directory',default=str(Path(__file__).resolve().parents[1]/'out'))
    args=parser.parse_args()
    if not Path(args.directory).is_dir():parser.error('Build the static export first.')
    handler=functools.partial(PreviewHandler,directory=args.directory)
    server=http.server.ThreadingHTTPServer(('127.0.0.1',args.port),handler)
    print(f'Local UCXO review: http://127.0.0.1:{args.port}/',flush=True)
    server.serve_forever()

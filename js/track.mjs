function Track(looper) {
    const EMPTY = 0,
          WAITING_FOR_INPUT = 1,
          RECORDING = 2,
          PLAYING = 3,
          WAITING_TO_STOP = 4,
          STOPPED = 5;
    
    this.looper = looper;
    this.time = 0;
    this.isMuted = false;
    
    this.quantize = 4;  // => 1/x
    this.trackLength = looper.MAX_TRACK_LENGTH;
    this.messages = [];
    this.trackPointer = 0;
    this.OnTick = (delta) => {
        let t = this.time;
        this.time = (t + delta) % this.trackLength;
        if(this.time < t)
            this.messages.forEach(msg => { msg.played = false; });

        this.CheckNextMessage();
    };
    this.ExecuteNextMessage = () => {
        if(!looper.isErasing) {
            if(!this.isMuted)
                this.looper.ExecuteMessage(this.messages[this.trackPointer]);
            this.messages[this.trackPointer].played = true;
            this.trackPointer = (this.trackPointer + 1) % this.messages.length;
        }
        else this.RemoveMessageAtPointer();

        this.CheckNextMessage();
    }; 
    this.CheckNextMessage = () => {
        if(this.messages.length < 1)
            return;

        let msg = this.messages[this.trackPointer];
        if(msg.time <= this.time && !msg.played)
            this.ExecuteNextMessage();
    };
    this.Stop = () => { this.time = 0; this.trackPointer = 0; this.messages.forEach((m) => { m.played = false; })}
    this.RecordMessage = (msg) => {
        this.messages.splice(this.trackPointer, 0, {
            time : this.quantize == 0 ? this.time : Quantize(this.time, 1/this.quantize),
            message : msg,
            played : true
        });
    };
    this.SetTrackLength = () => { this.trackLength = this.time == 0 ? 1 : Math.ceil(this.time); }
    this.RemoveMessageAtPointer = () => {
        this.messages.splice(this.trackPointer, 1);
    };
    this.ClearAll = () => {
        this.trackLength = looper.MAX_TRACK_LENGTH;
        this.messages = [];
        this.trackPointer = 0;
        this.time = looper.current.time;
    };
    this.ToggleMute = () => { this.isMuted = !this.isMuted; };
}

function Quantize(n, x)
{
    if(x/2>n)
       return 0;
    else if(x>n)
        return x;
 
    n = n + x/2;
    n = n - (n%x);
    return n;
}

export { Track };

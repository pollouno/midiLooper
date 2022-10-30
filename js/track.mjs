function Track(looper) {
    const EMPTY = 0,
          PLAYING   = 3,
          WAITING_TO_STOP   = 4,
          STOPPED   = 5;
    
    this.looper = looper;
    this.time = 0;
    this.state = EMPTY;

    this.quantize = 4;  // => 1/x
    this.trackLength = -1;
    this.messages = [];
    this.trackPointer = 0;
    this.session = 0;
    this.OnTick = (delta) => {
        switch (this.state) {
            case EMPTY:
            case STOPPED:
                return;
            default:
                let t = this.time;
                this.time = (t + delta) % this.trackLength == -1 ? looper.MAX_TRACK_LENGTH : this.trackLength;
                
                if(Math.floor(t) != Math.floor(this.time) && state == WAITING_TO_STOP)
                    this.Stop();
                else if(this.time < t) {
                    this.messages.forEach(msg => { msg.played = false; });
                    if(this.trackLength == -1)
                        this.trackLength = looper.MAX_TRACK_LENGTH;
                }
                
                this.CheckNextMessage();
                break;
        }
        
    };
    this.ExecuteNextMessage = () => {
        this.looper.ExecuteMessage(this.messages[this.trackPointer]);
        this.messages[this.trackPointer].played = true;
        this.trackPointer = (this.trackPointer + 1) % this.messages.length;

        this.CheckNextMessage();
    }; 
    this.CheckNextMessage = () => {
        if(this.messages.length < 1)
            return;

        let msg = this.messages[this.trackPointer];
        if(msg.time <= this.time && !msg.played)
            this.ExecuteNextMessage();
    };
    this.Stop = () => {
        if(this.trackLength == -1)
            this.End();

        this.time = 0;
        this.trackPointer = 0;
        this.messages.forEach((m) => { m.played = false; });
        this.state = STOPPED;
    };
    this.RecordMessage = (msg) => {
        if(this.state == EMPTY)
            this.Begin();
        this.messages.splice(this.trackPointer, 0, new TrackEvent(this, msg));
    };
    this.Begin  = () => { this.state = PLAYING; this.time = looper.time % 1; }
    this.End    = () => { this.trackLength = this.time == 0 ? 1 : Math.ceil(this.time); }
    this.Play   = () => { this.state = PLAYING; };
    this.Pause  = () => {
        if(this.messages.length == 0) {
            this.Clear();
            return;
        }
    
        this.state = WAITING_TO_STOP;
        if(this.trackLength == -1)
            this.End();
    };
    this.OnSelect   = () => {  };
    this.OnDeselect = () => {  };
    this.Clear = () => {
        this.trackLength = -1;
        this.messages = [];
        this.trackPointer = 0;
        this.time = -1;
        this.state = EMPTY;
    };
    this.RemoveMessageAtPointer = () => {
        this.messages.splice(this.trackPointer, 1);
    };
    this.EndSession = () => { this.session++; if(this.trackLength == -1) this.End(); }
    this.Undo = () => {
        if(this.session == 0)
            return;
            
        for (let i = 0; i < this.messages.length; i++) {
            const msg = this.messages[i];
            if(msg.session == this.session - 1)
                this.messages[i] = null;
        }
        this.messages = this.messages.filter((n) => n);
        this.session--;
    }
    this.IsPlaying = () => this.state == PLAYING;
    this.IsEmpty   = () => this.state == EMPTY;
    this.CanUndo   = () => this.session > 0;
}

function TrackEvent(track, msg)
{
    this.time = track.quantize == 0 ? track.time : Quantize(track.time, 1/track.quantize);
    this.message = msg;
    this.played = true;
    this.session = track.session;
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

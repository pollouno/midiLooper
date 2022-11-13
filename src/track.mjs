function Track(looper) {
    const EMPTY = 0,
          PLAYING   = 3,
          WAITING_TO_STOP   = 4,
          STOPPED   = 5;
    
    this.looper = looper;
    this.time = 0;
    this.toChannel = 0;
    this.state = EMPTY;
    this.isBeat    = false;
    this.isMeasure = false;
    this.quantize = 16;  // => 1/x
    this.trackLength = -1;
    this.messages = [];
    this.session = 0;
    this.OnTick = (delta) => {
        switch (this.state) {
            case EMPTY:
            case STOPPED:
                this.isBeat = this.isMeasue = false;
                return;
            default:
                let t = this.time;
                this.time = (t + delta) % (this.trackLength == -1 ? looper.MAX_TRACK_LENGTH : this.trackLength);

                this.isBeat = Math.floor(t * looper.MEASURE_LENGTH) != Math.floor(this.time * looper.MEASURE_LENGTH);
                this.isMeasue = Math.floor(t) != Math.floor(this.time);

                if(this.isBeat && this.state == WAITING_TO_STOP) {
                    this.Stop();
                    return;
                }
                else if(this.time < t) {
                    this.messages.forEach(msg => { msg.played = false; });
                    if(this.trackLength == -1)
                        this.trackLength = looper.MAX_TRACK_LENGTH;
                }
                
                this.CheckMessages();
                break;
        }
        
    };
    this.SetChannel = (ch) => {
        if(ch < 0 || ch > 16)
            return;
        this.toChannel = ch;
        console.log(`Track channel set to ${ch}!`);
    }
    this.ExecuteMessage = (msg) => {
        msg.played = true;
        this.looper.ExecuteMessage(msg.message, this.toChannel);
    }; 
    this.CheckMessages = () => {
        if(this.messages.length < 1)
            return;

        this.messages.forEach(msg => {
            if(msg.time <= this.time && !msg.played)
                this.ExecuteMessage(msg);
        });
    };
    this.Stop = () => {
        if(this.trackLength == -1)
            this.End();

        this.time = 0;
        this.messages.forEach((m) => { m.played = false; });
        this.state = STOPPED;
        this.looper.OnTrackStop();
    };
    this.RecordMessage = (msg) => {
        if(this.state == EMPTY)
            this.Begin();
            
        this.messages.push(new TrackEvent(this, msg));
        // this.messages.sort((a, b) => { return a.time - b.time; });
    };
    this.Begin  = () => {
        this.state = PLAYING;
        this.time = (looper.current.time * looper.MEASURE_LENGTH) % 1;
        this.time /= looper.MEASURE_LENGTH;
    }
    this.End    = () => {
        let nextBeat = Math.ceil(this.time * looper.MEASURE_LENGTH) / looper.MEASURE_LENGTH;
        this.trackLength = this.time == 0 ? 1 : nextBeat;
    }
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
        this.time = 0;
        this.state = EMPTY;
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
        if(this.messages.length < 1) {
            this.Clear();
            return;
        }
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

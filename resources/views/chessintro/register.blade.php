<div class="mt-4 mb-5">
    <h2 class="font-weight-light mb-1">民族棋项目体验</h2>
    <p class="text-muted">清华附中学生节</p>
    <hr class="my-4">
    <ul class="nav nav-tabs d-none" role="tablist">
        <li class="nav-item" role="presentation">
            <a class="nav-link active" id="registerTabRegister" data-toggle="tab" href="#registerRegisterPanel" role="tab">① 注册</a>
        </li>
        <li class="nav-item" role="presentation">
            <a class="nav-link" id="registerTabGuestTry" data-toggle="tab" href="#guestTryPanel" role="tab">② 体验</a>
        </li>
    </ul>
    <div class="tab-content">
        <div class="tab-pane fade show active" id="registerRegisterPanel" role="tabpanel">
            <h3>① 注册</h3>
            <div class="form-row">
                <div class="col-12 col-sm-auto text-nowrap">
                    <label class="my-1 mr-2" for="selectEschoolGroup">我是<strong>清华附中</strong>的</label>
                    <select class="custom-select my-1" id="selectEschoolGroup" style="width:7em;">
                        <option selected>请选择...</option>
                        <option value="1">教师</option>
                        <option value="4">学生</option>
                    </select>
                </div>

                <div class="col data-input-group">
                    <label class="sr-only" for="inputEschoolCode">学号</label>
                    <input type="text" class="form-control my-1" id="inputEschoolCode" placeholder="学号...（如 G19xxxx）">
                </div>

                <div class="col data-input-group">
                    <label class="sr-only" for="inputEschoolName">姓名</label>
                    <input type="text" class="form-control my-1" id="inputEschoolName" placeholder="姓名...">
                </div>

                <div class="col-auto">
                    <button type="submit" class="btn btn-primary my-1" id="eschoolSubmit">提交</button>
                </div>
            </div>
            <p class="text-danger hide" id="eschoolError"></p>
        </div>
        <div class="tab-pane fade" id="guestTryPanel" role="tabpanel">
            <h3>② 体验</h3>
            <p class="lead">请选择您要体验的项目：</p>
            <div class="list-group">
                <a href="#" class="list-group-item list-group-item-action" data-guest-try="1002">
                    <h4>捉鳖</h4>
                    <p class="mb-0">两子逼迫一子到四角，即吃子，吃掉全部棋子为胜。</p>
                </a>
                <a href="#" class="list-group-item list-group-item-action" data-guest-try="1003">
                    <h4>鹿棋</h4>
                    <p class="mb-0">蓝色猎狗，一步步移动，憋死鹿；黄色鹿，可跳吃反击猎狗，直到无法被憋死。</p>
                </a>
                <a href="#tabUse" class="list-group-item list-group-item-action list-group-item-light" data-toggle-link="tab">或自由探索 ChessTerm 的功能</a>
            </div>
        </div>
    </div>
    <p class="text-success my-2 hide" id="eschoolSuccess"></p>
</div>
<div class="modal fade" id="eschoolChooseModal" tabindex="-1" role="dialog" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">有个小问题...</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <p>找到多个符合条件的用户，哪个才是您呢？</p>
                <div class="list-group mb-2" id="eschoolChooseList"></div>
                <p class="small text-muted mb-0">请点击正确的一项。</p>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">取消</button>
            </div>
        </div>
    </div>
</div>

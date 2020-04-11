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
        <input type="text" class="form-control my-1" id="inputEschoolCode" placeholder="学号...">
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
<p class="text-success hide" id="eschoolSuccess"></p>
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
